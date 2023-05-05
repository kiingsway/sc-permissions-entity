interface IDefinitionItem {
  URLSite: {
    URLSite: string
    Title: string
  }
  ListaBiblioteca?: {
    Title: string
  }
  FileSystemObjectType: number
  Id: number
  ContentTypeId: string
  Title?: string
  IdListaAntiga?: number
  DefinicaoAntiga: string
  Ativo: boolean
  TipoEntidade: string
  MetodoLocalizacaoItem?: string
  HerdaPermissoesPai: boolean
  URLSiteId: number
  ListaBibliotecaId?: number
  GrupoA001Id: Array<number>
  GrupoAD01Id: Array<number>
  GrupoAH01Id: Array<number>
  GrupoAP01Id: Array<number>
  GrupoAP02Id: Array<number>
  GrupoAP03Id: Array<number>
  GrupoAP04Id: Array<number>
  GrupoAdministradoresSolicitac_x0Id: Array<number>
  GrupoAdministradoresTIId: Array<number>
  GrupoAprovadoresId: Array<number>
  GrupoB001Id: Array<number>
  GrupoBibliotecariosId: Array<number>
  GrupoCLTEstagiariosId: Array<number>
  GrupoColaboradoresId: Array<number>
  GrupoColaboradoresAdmId: Array<number>
  ConvidadosId: Array<number>
  GrupoConvidadosRHId: Array<number>
  GrupoEJ01Id: Array<number>
  GrupoF001Id?: number
  GrupoGC01Id?: number
  GrupoGC02Id?: number
  GrupoGC03Id?: number
  GrupoGJ01Id?: number
  GrupoIC01Id: Array<number>
  GrupoIC02Id?: number
  GrupoIC03Id?: number
  GrupoIGB1Id?: number
  GrupoIGB2Id?: number
  GrupoIGR1Id?: number
  GrupoM001Id?: number
  GrupoP001Id: any
  GrupoP002Id: any
  GrupoPP01Id?: number
  GrupoProprietariosPortaisRHId?: number
  GrupoRH03Id?: number
  GrupoRecursosHumanosId?: number
  GrupoS001Id?: number
  GrupoS002Id: any
  GrupoSA01Id?: number
  GrupoSociosId?: number
  GrupoSociosAdministradoresId?: number
  GrupoT001Id?: number
  GrupoT002Id?: number
  GrupoTPM1Id?: number
  TodosId?: number
  GrupoVisitantesSolicitac_x00f5_eId?: number
  RecebedoresEmailGLSId?: number
  RecebedoresEmailsIntegracaoId?: number
  RecebedoresEmailsProvidenciasId?: number
  ResponsaveisCargaMassaId?: number
  VisitantesMarketingId?: number
  ProprietariosMarketingId?: number
  MembrosMarketingId?: number
  ID: number
  Modified: string
  Created: string
  AuthorId: number
  EditorId: number
  OData__UIVersionString: string
  Attachments: boolean
  GUID: string
}

interface IRoleAssignmentData {
  Items: IRoleAssignmentItem[]
  Id: string
}

interface IRoleAssignmentItem {
  Id: number
  ID: number
  Title: string
}

interface IDefinitionFieldsItem {
  Description: string
  EntityPropertyName: string
  Title: string
  LookupList?: string
}

interface ISiteItem {
  Id: number
  Title: string
  Ativo: boolean
  URLSite: string
  OnPremises: boolean
  ID: number
}

interface ISPData {
  Definition: IDefinitionItem[]
  RoleAssignments: IRoleAssignmentData
  DefinitionFields: IDefinitionFieldsItem[]
  Sites: ISiteItem[]
}