import axios from "axios";

type ReqMethods = 'GET' | 'POST' | 'PATCH';

const Headers = { Accept: 'application/json;odata=nometadata' };

export async function GetDefinition(Env: 'HML' | 'PROD'): Promise<{ data: { value: IDefinitionItem[] } }> {
    const Site = Env === 'HML' ? 'http://homologacao2/sites/TI' : 'http://equipes/sites/TI';
    const Method: ReqMethods = 'GET';
    const Uri = '_api/web/lists/PermissionamentoEntidadesList/items?$top=5000&$filter=Ativo eq 1&$select=URLSite/URLSite,URLSite/Title,ListaBiblioteca/Title,*&$expand=URLSite,ListaBiblioteca';
    // const Uri = `_api/web/lists/PermissionamentoEntidadesList/items?$top=5000&$filter=(URLSiteId eq 12 or URLSiteId eq 26 or URLSiteId eq 27 or URLSiteId eq 6 or URLSiteId eq 29 or URLSiteId eq 28 or URLSiteId eq 30 or URLSiteId eq 3 or URLSiteId eq 24 or URLSiteId eq 39 or URLSiteId eq 31) and Ativo eq 1&$select=URLSite/URLSite,URLSite/Title,ListaBiblioteca/Title,*&$expand=URLSite,ListaBiblioteca`

    return await RequestFlow({ Site, Method, Uri, Headers });
}

export async function GetDefinitionFields(Env: 'HML' | 'PROD'): Promise<{ data: { value: IDefinitionFieldsItem[] } }> {
    const Site = Env === 'HML' ? 'http://homologacao2/sites/TI' : 'http://equipes/sites/TI';
    const Method: ReqMethods = 'GET';
    const Uri = '_api/web/lists/PermissionamentoEntidadesList/Fields?$filter=CanBeDeleted eq true and Hidden eq false and ReadOnlyField eq false&$select=EntityPropertyName,Title,Description,LookupList';

    return await RequestFlow({ Site, Method, Uri, Headers });
}

export async function GetSites(Env: 'HML' | 'PROD'): Promise<{ data: { value: ISiteItem[] } }> {
    const Site = Env === 'HML' ? 'http://homologacao2/sites/TI' : 'http://equipes/sites/TI';
    const Method: ReqMethods = 'GET';
    const Uri = '_api/web/lists/PermissionamentoSitesList/items?$top=5000&$select=Id,Title,Ativo,URLSite,OnPremises';

    return await RequestFlow({ Site, Method, Uri, Headers });
}

export async function GetEntities(Env: 'HML' | 'PROD') {
    const Site = Env === 'HML' ? 'http://homologacao2/sites/TI' : 'http://equipes/sites/TI';
    const Method: ReqMethods = 'GET';
    const Uri = '_api/web/lists/PermissionamentoListasSitesList/items?$top=5000&$select=Id,Title';

    return await RequestFlow({ Site, Method, Uri, Headers });
}

export async function GetRoleAssignments(Env: 'HML' | 'PROD'): Promise<{ data: IRoleAssignmentData }> {
    const Site = Env === 'HML' ? 'http://homologacao2/sites/TI' : 'http://equipes/sites/TI';
    const Method: ReqMethods = 'GET';
    const Uri = '_api/web/lists/PermissionamentoNiveisPermissaoList?$select=Id,Items/Id,Items/Title&$expand=Items';

    return await RequestFlow({ Site, Method, Uri, Headers });
}

export async function GetSiteGroups(Site: string, OnPremises: boolean = true) {
    const Method: ReqMethods = 'GET';
    const Uri = '_api/web/siteGroups?$top=5000';

    return await RequestFlow({ Site, Method, Uri, Headers });
}

export async function GetSiteRoleAss(Site: string, OnPremises: boolean = true) {
    const Method: ReqMethods = 'GET';
    const Uri = '_api/web/roleDefinitions?$top=5000';

    return await RequestFlow({ Site, Method, Uri, Headers });
}

export async function GetSitePermissions(Site: string, OnPremises: boolean = true) {
    const Method: ReqMethods = 'GET';
    const Uri = '_api/web?$expand=hasUniqueRoleAssignments,roleAssignments,roleDefinitions,roleAssignments/Member/users,roleAssignments/RoleDefinitionBindings,ParentWeb&$select=roleAssignments/RoleDefinitionBindings/Id,roleAssignments/RoleDefinitionBindings/Name,ServerRelativeUrl';

    return await RequestFlow({ Site, Method, Uri, Headers });
}

export async function GetListInfo(Site: string, OnPremises: boolean = true, List: string) {
    const Method: ReqMethods = 'GET';
    const Uri = `_api/web/lists/GetByTitle('${List}')?$select=EntityTypeName,Title,ParentWebUrl`;

    return await RequestFlow({ Site, Method, Uri, Headers, OnPremises });
}

export async function GetListPermissions(Site: string, OnPremises: boolean = true, List: string) {
    const Method: ReqMethods = 'GET';
    const Uri = `_api/web/lists/${List}?$expand=hasUniqueRoleAssignments,roleAssignments,roleDefinitions,roleAssignments/Member/users,roleAssignments/RoleDefinitionBindings&$select=roleAssignments/RoleDefinitionBindings/Id,roleAssignments/RoleDefinitionBindings/Name`;

    return await RequestFlow({ Site, Method, Uri, Headers, OnPremises });
}

export async function GetItemById(Site: string, OnPremises: boolean = true, List: string, ItemId: number) {
    const Method: ReqMethods = 'GET';
    const Uri = `_api/web/lists/${List}/items(${ItemId})?$select=HasUniqueRoleAssignments,roleAssignments/RoleDefinitionBindings/Id,roleAssignments/RoleDefinitionBindings/Name&$expand=roleAssignments/Member,roleAssignments/RoleDefinitionBindings`;

    return await RequestFlow({ Site, Method, Uri, Headers, OnPremises });
}

export async function GetItemByFileRelativeUrl(Site: string, OnPremises: boolean = true, List: string, File: string, ParentWebUrl: string) {
    const Method: ReqMethods = 'GET';
    const Uri = `_api/web/GetFileByServerRelativeUrl('${ParentWebUrl}/${List}/${File}')/ListItemAllFields?$select=HasUniqueRoleAssignments,roleAssignments/RoleDefinitionBindings/Id,roleAssignments/RoleDefinitionBindings/Name&$expand=roleAssignments/Member,roleAssignments/RoleDefinitionBindings`;

    return await RequestFlow({ Site, Method, Uri, Headers, OnPremises });
}

export async function GetFolderByFolderRelativeUrl(Site: string, OnPremises: boolean = true, List: string, ParentWebUrl: string, Folder: string) {
    const Method: ReqMethods = 'GET';
    const Uri = `_api/web/GetFolderByServerRelativeUrl('${ParentWebUrl}/${List}/${Folder}')/ListItemAllFields?$select=HasUniqueRoleAssignments,roleAssignments/RoleDefinitionBindings/Id,roleAssignments/RoleDefinitionBindings/Name&$expand=roleAssignments/Member,roleAssignments/RoleDefinitionBindings`;

    return await RequestFlow({ Site, Method, Uri, Headers, OnPremises });
}

export async function GetItemByTitle(Site: string, OnPremises: boolean = true, List: string, Title: string) {
    const Method: ReqMethods = 'GET';
    const Uri = `_api/web/lists/${List}/items?$filter=Title eq '${Title}'&$top=1&$select=HasUniqueRoleAssignments,roleAssignments/RoleDefinitionBindings/Id,roleAssignments/RoleDefinitionBindings/Name&$expand=roleAssignments/Member,roleAssignments/RoleDefinitionBindings`;

    return await RequestFlow({ Site, Method, Uri, Headers, OnPremises });
}

async function RequestFlow(data: { Site: string, Method: ReqMethods, Uri: string, Headers?: any, Body?: any, OnPremises?: boolean }) {

    return axios({
        method: 'POST',
        url: 'https://prod-13.brazilsouth.logic.azure.com:443/workflows/293c3b8d873a42098daed61e42f8acd8/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1kW-bAuCK2heVInaBBhd7xpSaoH-psUrVXLeDhKU8Xw',
        headers: { Accept: 'application/json' },
        data
    });

}