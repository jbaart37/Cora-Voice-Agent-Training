param name string
param location string = resourceGroup().location
param tags object = {}

@description('Address prefix for the virtual network')
param addressPrefix string = '10.0.0.0/16'

@description('Subnet for Container Apps Environment')
param containerAppsSubnetName string = 'snet-containerapp'

@description('Address prefix for Container Apps subnet (minimum /23 required)')
param containerAppsSubnetPrefix string = '10.0.0.0/23'

@description('Subnet for Private Endpoints')
param privateEndpointsSubnetName string = 'snet-privateendpoints'

@description('Address prefix for Private Endpoints subnet')
param privateEndpointsSubnetPrefix string = '10.0.2.0/24'

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2023-05-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    addressSpace: {
      addressPrefixes: [
        addressPrefix
      ]
    }
    subnets: [
      {
        name: containerAppsSubnetName
        properties: {
          addressPrefix: containerAppsSubnetPrefix
          // Delegation removed - Container Apps Environment will add it automatically
        }
      }
      {
        name: privateEndpointsSubnetName
        properties: {
          addressPrefix: privateEndpointsSubnetPrefix
          privateEndpointNetworkPolicies: 'Disabled'
        }
      }
    ]
  }
}

output name string = virtualNetwork.name
output id string = virtualNetwork.id
output containerAppsSubnetId string = virtualNetwork.properties.subnets[0].id
output privateEndpointsSubnetId string = virtualNetwork.properties.subnets[1].id
