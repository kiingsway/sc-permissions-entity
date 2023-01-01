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
  TipoEntidade: "Site" | "Lista/Biblioteca" | "Pasta/Item de Lista/Biblioteca";
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
  entityPermissions: ISiteDefinition[];
  fieldGroups: IFieldGroup[];
  roleAssignments: IRoleAssignmentsList;
}

interface IPreDados {
  permissoesEntidade: ISiteDefinition[];
  gruposCampos: IFieldGroup[];
  niveisPermissoes: IRoleAssignmentsList;
}

type IRoleAssignmentsList = Record<string, string>;

interface ISitePermissions {
  ParentWeb: any;
  RoleAssignments: IRoleAssignment[];
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
  RoleAssignments: IRoleAssignment[];
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
  TemPermissao: null | string;
  DeveriaTerPermissao: null | string;
  Erro: boolean;
  Mensagem: string | null;
}

interface IRoleAssignment {
  Member: {
    Users?: IRoleAssignmentUser[];
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
    UserId?: any
    UserPrincipalName?: string
  }
  RoleDefinitionBindings: IRoleDefinitionBinding[]
}

interface IRoleAssignmentUser {
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
  UserId?: {
    NameId: string
    NameIdIssuer: string
  }
  UserPrincipalName?: string
}

interface IRoleDefinitionBinding {
  Id: number
  Name: string
}

interface IPermissions {
  HasUniqueRoleAssignments: boolean
  RoleAssignments: IRoleAssignment[];
  RoleDefinitions?: IRoleDefinition[];
  ServerRelativeUrl?: string
  ParentWeb?: IParentWeb;
}

interface IRoleDefinition {
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
}

interface IParentWeb {
  Configuration: number
  Created: string
  Description: string
  Id: string
  Language: number
  LastItemModifiedDate: string
  LastItemUserModifiedDate: string
  ServerRelativeUrl: string
  Title: string
  WebTemplate: string
  WebTemplateId: number
}