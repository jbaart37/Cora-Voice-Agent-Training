param name string
param location string = resourceGroup().location
param tags object = {}
param logAnalyticsWorkspaceName string

@description('Resource ID of the subnet for Container Apps Environment (optional for VNet integration)')
param infrastructureSubnetId string = ''

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' existing = {
  name: logAnalyticsWorkspaceName
}

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
    vnetConfiguration: !empty(infrastructureSubnetId) ? {
      infrastructureSubnetId: infrastructureSubnetId
    } : null
    zoneRedundant: false
  }
}

output name string = containerAppsEnvironment.name
output id string = containerAppsEnvironment.id
