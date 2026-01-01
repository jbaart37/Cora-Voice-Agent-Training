@description('Principal ID of the identity to assign the role to')
param principalId string

@description('Role definition ID (GUID) to assign')
param roleDefinitionId string

@description('Resource ID of the Cognitive Services account to assign the role on')
param targetResourceId string

// Parse the resource ID to get the account name
var accountName = last(split(targetResourceId, '/'))

resource cognitiveServicesAccount 'Microsoft.CognitiveServices/accounts@2023-05-01' existing = {
  name: accountName
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(targetResourceId, principalId, roleDefinitionId)
  scope: cognitiveServicesAccount
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', roleDefinitionId)
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}

output roleAssignmentId string = roleAssignment.id
