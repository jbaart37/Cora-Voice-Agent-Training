@description('Principal ID of the identity to assign the role to')
param principalId string

@description('Role definition ID (GUID) to assign')
param roleDefinitionId string

@description('Resource ID of the target resource to assign the role on')
param targetResourceId string

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(targetResourceId, principalId, roleDefinitionId)
  scope: resourceId('Microsoft.Storage/storageAccounts', last(split(targetResourceId, '/')))
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', roleDefinitionId)
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}

output roleAssignmentId string = roleAssignment.id
