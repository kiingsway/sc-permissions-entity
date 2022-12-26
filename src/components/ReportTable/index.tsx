import React from 'react'
import Table from '../../../themes/Table';
import { v4 as uuidv4 } from 'uuid';
import styles from './ReportTable.module.scss';

interface Props {
  relatorio: IItemReport[];

}

export default function ReportTable({ relatorio }: Props) {
  const idsDefinicao = relatorio.map(i => i.IdDefinicao).filter(onlyUnique)

  return (
    <Table>
      <Cols />
      <tbody>

        {idsDefinicao.map(i => {
          if (!i) return;

          const report = relatorio.filter(d => d.IdDefinicao === i)

          return (
            <Frag key={i}>
              {report.map((r, idx) => {

                return (
                  <tr key={uuidv4()} className={idx !== report.length - 1 ? styles.no_border_row : undefined}>
                    {idx === 0 ? <td rowSpan={report.length}>{i}</td> : null}
                    {idx === 0 ? <td rowSpan={report.length}>{r.Site}</td> : null}
                    {idx === 0 ? <td rowSpan={report.length}>{r.Entidade}</td> : null}
                    {idx === 0 ? <td rowSpan={report.length}>{r.NomeEntidade}</td> : null}
                    <td>{r.Verificacao}</td>
                    <td>{r.Erro ? '❌ Erro' : '✅ Ok'}</td>
                    <td>{r.Mensagem}</td>
                  </tr>
                )
              })}
            </Frag>
          )
        })}
      </tbody>
    </Table>
  )
}

const Frag = ({ children }: { children: any }) => {
  return (
    <>
      {children}
    </>
  )
}

const Cols = () => (
  <thead>
    <tr>
      <th>ID da Definição</th>
      <th>Site</th>
      <th>Tipo da Entidade</th>
      <th>Nome da Entidade</th>
      <th>Verificando</th>
      <th>Status</th>
      <th>Observações</th>
    </tr>
  </thead>
)

function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}