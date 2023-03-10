import React from 'react'

enum TipoEntidade {
  Site = "Site",
  Lista = "Lista/Biblioteca",
  Item = "Pasta/Item de Lista/Biblioteca"
}

export function getNomeEntidade(perm: ISiteDefinition) {

  const ListaBiblioteca = perm?.ListaBiblioteca?.Title || '';

  return perm.TipoEntidade === TipoEntidade.Site ?
    perm.SitePermissions.ServerRelativeUrl
    : (perm.TipoEntidade === TipoEntidade.Lista ?
      ListaBiblioteca
      : `${ListaBiblioteca} - ${perm.MetodoLocalizacaoItem} - "${perm.Title}"`
    );
}

export function getRoleIdsAndNames(preData: IPreData, perm: ISiteDefinition) {

  return preData.fieldGroups.map(g => {

    const fieldSpId: number | null = perm[`${g.EntityPropertyName}Id` as keyof typeof perm];
    const roleDefSpIds = fieldSpId && (Array.isArray(fieldSpId) ? Boolean(fieldSpId.length) : true) ? [fieldSpId] : null
    const roleDefNames = roleDefSpIds ? roleDefSpIds.map((id: number) => preData.roleAssignments[id]).sort() : null;
    const roleDefIds = roleDefNames ? roleDefNames.map(r => perm.SitePermissions.RoleDefinitions.filter(d => d.Name === r)[0]?.Id).sort() : null;

    return {
      Title: g.Title,
      RoleSpIds: roleDefSpIds,
      RoleNames: roleDefNames,
      RoleIds: roleDefIds,
    }
  });

}

export function isSameArray(array1: any, array2: any) {

  try {
    if (!Array.isArray(array1) || !Array.isArray(array2)) return false;
    const array2Sorted = array2.slice().sort();
    return array1.length === array2.length && array1.slice().sort().every(function (value, index) {
      return value === array2Sorted[index];
    });

  } catch { return false }
}

export function consoleGroup(title: string, obj: any) {
  console.group(title)
  console.log(obj)
  console.groupEnd();
}

export function joinAnd(arr: any) {
  if (!arr || !Array.isArray(arr)) return null;
  return arr.join(', ').replace(/, ([^,]*)$/, ' e $1')
}