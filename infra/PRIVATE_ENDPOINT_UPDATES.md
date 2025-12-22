# Private Endpoint Infrastructure Updates

## Overview
Updated the Bicep infrastructure to include VNet integration and Private Endpoint for Storage Account to ensure audit-proof deployments. This prevents corporate audits from breaking the application by disabling public network access on storage accounts.

## Files Created

### Network Infrastructure
- **`infra/core/network/virtual-network.bicep`**
  - Creates VNet with two subnets:
    - Container Apps subnet (10.0.0.0/23) - delegated to Microsoft.App/environments
    - Private Endpoints subnet (10.0.2.0/24)

- **`infra/core/network/private-endpoint.bicep`**
  - Creates Private Endpoint for Storage Account
  - Creates Private DNS Zone (privatelink.table.core.windows.net)
  - Links DNS Zone to VNet for automatic resolution
  - Registers DNS A record for storage account

### Storage Infrastructure
- **`infra/core/storage/storage-account.bicep`**
  - Creates Storage Account with `publicNetworkAccess: Disabled`
  - Creates Table Service and conversationscores table
  - Configured for audit compliance

### Security
- **`infra/core/security/role-assignment.bicep`**
  - Assigns RBAC roles to Container App managed identity
  - Used for Storage Blob Data Contributor and Storage Table Data Contributor

## Files Modified

### Container Apps Environment
- **`infra/core/host/container-apps-environment.bicep`**
  - Added `infrastructureSubnetId` parameter for VNet integration
  - Configures VNet integration when subnet ID provided

### Container App
- **`infra/core/host/container-app.bicep`**
  - Added `identityPrincipalId` output for role assignments

### Main Infrastructure
- **`infra/main.bicep`**
  - Added VNet module
  - Added Storage Account module
  - Added Private Endpoint module for Table Storage
  - Added role assignments for Storage Blob Data Contributor
  - Added role assignments for Storage Table Data Contributor
  - Added `AZURE_STORAGE_ACCOUNT_NAME` environment variable to Container App
  - Added `AZURE_STORAGE_ACCOUNT_NAME` to outputs

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Virtual Network (10.0.0.0/16)                          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Container Apps Subnet (10.0.0.0/23)             │ │
│  │ Delegated: Microsoft.App/environments           │ │
│  │                                                  │ │
│  │  ┌────────────────────────────────────────────┐ │ │
│  │  │ Container App Environment (VNet-integrated)│ │ │
│  │  │                                             │ │ │
│  │  │  ┌──────────────────────────────────────┐  │ │ │
│  │  │  │ Voice Agent Container App           │  │ │ │
│  │  │  │ - Managed Identity                  │  │ │ │
│  │  │  │ - Storage roles assigned            │  │ │ │
│  │  │  └──────────────────────────────────────┘  │ │ │
│  │  └────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Private Endpoints Subnet (10.0.2.0/24)          │ │
│  │                                                  │ │
│  │  ┌────────────────────────────────────────────┐ │ │
│  │  │ Private Endpoint (10.0.2.x)               │ │ │
│  │  │ → Storage Account (Table)                 │ │ │
│  │  └────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Private DNS Zone                                 │ │
│  │ privatelink.table.core.windows.net              │ │
│  │ → voiceagentXXXX → 10.0.2.x                    │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Storage Account (voiceagentXXXX)                       │
│ - Public Network Access: Disabled                      │
│ - Private Endpoint Connected                           │
│ - Managed Identity RBAC:                               │
│   ✓ Storage Blob Data Contributor                     │
│   ✓ Storage Table Data Contributor                    │
└─────────────────────────────────────────────────────────┘
```

## Key Benefits

1. **Audit-Proof**: Storage account can have public access disabled without breaking the app
2. **Zero Trust**: All traffic flows through private network (no public exposure)
3. **Managed Identity**: No storage keys needed, RBAC-based authentication
4. **Automatic DNS**: Private DNS Zone automatically resolves storage FQDN to private IP
5. **Production-Ready**: Enterprise-grade architecture for compliance requirements

## Deployment

When participants run `azd up`, the infrastructure will automatically:
1. Create VNet with subnets
2. Deploy Container App Environment in VNet
3. Create Storage Account with public access disabled
4. Create Private Endpoint and Private DNS Zone
5. Assign storage roles to Container App managed identity

No manual configuration needed - fully automated deployment.

## Testing

To verify the deployment:
1. Check Container App logs for storage operations
2. Verify no `AuthorizationFailure` errors
3. Test Analytics dashboard to confirm Table Storage read/write
4. Verify storage account shows `publicNetworkAccess: Disabled`
5. Confirm Private Endpoint connection status: Approved

## Migration Notes

Existing deployments can be migrated by:
1. Running `azd up` with the updated Bicep files
2. Azure will create new VNet resources
3. Container App Environment will be recreated (new URL)
4. Update Entra ID redirect URIs to new Container App URL
5. Configure Easy Auth on new Container App
