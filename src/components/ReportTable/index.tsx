import React from 'react'

interface Props {
  relatorio: IItemReport[];

}

export default function ReportTable({ relatorio }: Props) {
  const idsDefinicao = relatorio.map(i => i.IdDefinicao).filter(onlyUnique)


  return (
    <table>
      <Cols />
        {idsDefinicao.map(i => {
          relatorio.filter(d => d.IdDefinicao === i);
          return (
            <tr>
              <td rowSpan={2}>{i}</td>
              <td>Site</td>
              <td>Tipo da Entidade</td>
              <td>Erro</td>
              <td>Observações</td>
            </tr>
          )
        })}
    </table>
  )
}

const Cols = () => (
  <tr>
    <th>ID da Definição</th>
    <th>Site</th>
    <th>Tipo da Entidade</th>
    <th>Erro</th>
    <th>Observações</th>
  </tr>
)

function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}