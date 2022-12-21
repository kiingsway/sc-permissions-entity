interface ISitePermission {
  URLSite: {
    Title: string
  }
  FileSystemObjectType: number
  Id: number
  ServerRedirectedEmbedUri: any
  ServerRedirectedEmbedUrl: string
  URLSiteId: number
  Ativo: boolean
  Title: any
  ID: number
  ContentTypeId: string
  Modified: string
  Created: string
  AuthorId: number
  EditorId: number
  OData__UIVersionString: string
  Attachments: boolean
  GUID: string
  ComplianceAssetId: any
  TipoEntidade: string
  HerdaPermissoesPai: boolean
  OData__x0041_D00Id: Array<number>
  MembrosSiteId: number
  xxxxId: number
  ListaBibliotecaId: any
  MetodoLocalizacaoItem: any
  SitePermissions: {
    RoleAssignments: Array<{
      Member: {
        Users?: Array<{
          Id: number
          IsHiddenInUI: boolean
          LoginName: string
          Title: string
          PrincipalType: number
          Email: string
          Expiration: string
          IsEmailAuthenticationGuestUser: boolean
          IsShareByEmailGuestUser: boolean
          IsSiteAdmin: boolean
          UserId: {
            NameId: string
            NameIdIssuer: string
          }
          UserPrincipalName: string
        }>
        Id: number
        IsHiddenInUI: boolean
        LoginName: string
        Title: string
        PrincipalType: number
        AllowMembersEditMembership?: boolean
        AllowRequestToJoinLeave?: boolean
        AutoAcceptRequestToJoinLeave?: boolean
        Description?: string
        OnlyAllowMembersViewMembership?: boolean
        OwnerTitle?: string
        RequestToJoinLeaveEmailSetting?: string
        Email?: string
        Expiration?: string
        IsEmailAuthenticationGuestUser?: boolean
        IsShareByEmailGuestUser?: boolean
        IsSiteAdmin?: boolean
        UserId?: {
          NameId: string
          NameIdIssuer: string
        }
        UserPrincipalName?: string
      }
      RoleDefinitionBindings: Array<{
        Id: number
        Name: string
      }>
    }>
    RoleDefinitions: Array<{
      BasePermissions: {
        High: string
        Low: string
      }
      Description?: string
      Hidden: boolean
      Id: number
      Name: string
      Order: number
      RoleTypeKind: number
    }>
    HasUniqueRoleAssignments: boolean
  }
  ListPermissions: any
  ItemPermissions: any
}

interface IItemReport {
  IdDefinicao: null | number;
  Site: null | string;
  Entidade: null | string;
  HerdaPermissao: null | boolean;
  DeveriaHerdarPermissao: null | boolean;
  Lista: null | string;
  IdItem: null | string | number;
  TemPermissao: null | boolean;
  DeveriaTerPermissao: null | boolean;
  Erro: boolean;
  Mensagem: null | string;
}
