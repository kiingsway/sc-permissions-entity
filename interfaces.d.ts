interface ISiteDefinition {
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
  OData__x0041_D00Id: any
  MembrosSiteId: any
  xxxxId: any
  ListaBibliotecaId: any
  MetodoLocalizacaoItem: any
  SitePermissions: ISitePermissions;
  ListPermissions: IListPermission | null;
  ItemPermissions: any
  ListaBiblioteca?: { Title: string } | null;
}

interface IFieldGroup {
  Description: string
  EntityPropertyName: string
  Title: string
  LookupList: string
}

interface IPreData {
  sitePermissions: ISiteDefinition[];
  fieldGroups: IFieldGroup[];
  roleAssignments: IRoleAssignments;
}

type IRoleAssignments = Record<string, string>;

interface ISitePermissions {
  ParentWeb: any;
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
  ServerRelativeUrl: string
}

interface IListPermission {
  RoleAssignments: Array<{
    Member: {
      Users: Array<{
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
      AllowMembersEditMembership: boolean
      AllowRequestToJoinLeave: boolean
      AutoAcceptRequestToJoinLeave: boolean
      Description: string
      OnlyAllowMembersViewMembership: boolean
      OwnerTitle: string
      RequestToJoinLeaveEmailSetting: any
    }
    RoleDefinitionBindings: Array<{
      Id: number
      Name: string
    }>
  }>
  HasUniqueRoleAssignments: boolean
}

interface IItemReport {
  IdDefinicao: null | number;
  Site: null | string;
  Entidade: null | string;
  NomeEntidade: null | string;
  Verificacao: null | string;
  HerdaPermissao: null | boolean;
  DeveriaHerdarPermissao: null | boolean;
  Lista: null | string;
  IdItem: null | string | number;
  TemPermissao: null | boolean;
  DeveriaTerPermissao: null | boolean;
  Erro: boolean;
  Mensagem: string | JSX.Element | null;
}
