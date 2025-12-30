targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('Id of the user or app to assign application roles')
param principalId string = ''

@description('Name of existing resource group to use')
param resourceGroupName string = ''

// Optional parameters
@description('Azure OpenAI endpoint for the voice agent')
param azureOpenAIEndpoint string = ''

@description('Azure OpenAI API key - leave empty to use managed identity')
@secure()
param azureOpenAIApiKey string = ''

@description('Model name to use for the agent')
param modelName string = 'gpt-4o-deployment'

// Variables
var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = {
  'azd-env-name': environmentName
  application: 'voice-agent-simulator'
}

// Use existing resource group name or create new one based on environment
var rgName = !empty(resourceGroupName) ? resourceGroupName : '${abbrs.resourcesResourceGroups}${environmentName}'

// Resource group - only create if name not provided
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = if (empty(resourceGroupName)) {
  name: rgName
  location: location
  tags: tags
}

// Virtual Network for Container Apps and Private Endpoints
module virtualNetwork 'core/network/virtual-network.bicep' = {
  name: 'virtual-network'
  scope: resourceGroup(rgName)
  params: {
    name: 'vnet-${resourceToken}'
    location: location
    tags: tags
  }
}

// Container Apps Environment
module containerAppsEnvironment 'core/host/container-apps-environment.bicep' = {
  name: 'container-apps-environment'
  scope: resourceGroup(rgName)
  params: {
    name: '${abbrs.appManagedEnvironments}${resourceToken}'
    location: location
    tags: tags
    logAnalyticsWorkspaceName: monitoring.outputs.logAnalyticsWorkspaceName
    infrastructureSubnetId: virtualNetwork.outputs.containerAppsSubnetId
  }
}

// Container Registry
module containerRegistry 'core/host/container-registry.bicep' = {
  name: 'container-registry'
  scope: resourceGroup(rgName)
  params: {
    name: '${abbrs.containerRegistryRegistries}${resourceToken}'
    location: location
    tags: tags
  }
}

// Monitoring (Log Analytics Workspace and Application Insights)
module monitoring 'core/monitor/monitoring.bicep' = {
  name: 'monitoring'
  scope: resourceGroup(rgName)
  params: {
    location: location
    tags: tags
    logAnalyticsName: '${abbrs.operationalInsightsWorkspaces}${resourceToken}'
    applicationInsightsName: '${abbrs.insightsComponents}${resourceToken}'
  }
}

// Voice Agent Web App (Container App)
module web 'core/host/container-app.bicep' = {
  name: 'web'
  scope: resourceGroup(rgName)
  params: {
    name: '${abbrs.appContainerApps}web-${resourceToken}'
    location: location
    tags: union(tags, { 'azd-service-name': 'web' })
    containerAppsEnvironmentName: containerAppsEnvironment.outputs.name
    containerRegistryName: containerRegistry.outputs.name
    containerCpuCoreCount: '1.0'
    containerMemory: '2.0Gi'
    env: [
      {
        name: 'AZURE_AI_FOUNDRY_ENDPOINT'
        value: azureOpenAIEndpoint
      }
      {
        name: 'AZURE_AI_FOUNDRY_API_KEY'
        secretRef: 'azure-ai-api-key'
      }
      {
        name: 'AZURE_AI_MODEL_NAME'
        value: modelName
      }
      {
        name: 'FLASK_ENV'
        value: 'production'
      }
      {
        name: 'AZURE_STORAGE_ACCOUNT_NAME'
        value: storage.outputs.name
      }
      {
        name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
        value: monitoring.outputs.applicationInsightsConnectionString
      }
    ]
    secrets: [
      {
        name: 'azure-ai-api-key'
        value: azureOpenAIApiKey
      }
    ]
    targetPort: 5000
  }
}

// Storage Account for conversation scores (audit-proof with private endpoint)
module storage 'core/storage/storage-account.bicep' = {
  name: 'storage'
  scope: resourceGroup(rgName)
  params: {
    name: 'voiceagent${resourceToken}'
    location: location
    tags: tags
    publicNetworkAccess: 'Disabled'
  }
}

// Private Endpoint for Storage Account (Table)
module storagePrivateEndpoint 'core/network/private-endpoint.bicep' = {
  name: 'storage-private-endpoint'
  scope: resourceGroup(rgName)
  params: {
    name: 'pe-storage-table-${resourceToken}'
    location: location
    tags: tags
    subnetId: virtualNetwork.outputs.privateEndpointsSubnetId
    storageAccountId: storage.outputs.id
    groupId: 'table'
    privateDnsZoneName: 'privatelink.table.${environment().suffixes.storage}'
    virtualNetworkId: virtualNetwork.outputs.id
  }
}

// Role assignment: Storage Blob Data Contributor
module storageBlobRoleAssignment 'core/security/role-assignment.bicep' = {
  name: 'storage-blob-role-assignment'
  scope: resourceGroup(rgName)
  params: {
    principalId: web.outputs.identityPrincipalId
    roleDefinitionId: 'ba92f5b4-2d11-453d-a403-e96b0029c9fe' // Storage Blob Data Contributor
    targetResourceId: storage.outputs.id
  }
}

// Role assignment: Storage Table Data Contributor
module storageTableRoleAssignment 'core/security/role-assignment.bicep' = {
  name: 'storage-table-role-assignment'
  scope: resourceGroup(rgName)
  params: {
    principalId: web.outputs.identityPrincipalId
    roleDefinitionId: '0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3' // Storage Table Data Contributor
    targetResourceId: storage.outputs.id
  }
}

// Outputs
output AZURE_LOCATION string = location
output AZURE_RESOURCE_GROUP string = rgName
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.outputs.loginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerRegistry.outputs.name
output AZURE_STORAGE_ACCOUNT_NAME string = storage.outputs.name
output APPLICATIONINSIGHTS_CONNECTION_STRING string = monitoring.outputs.applicationInsightsConnectionString
output WEB_URI string = web.outputs.uri
