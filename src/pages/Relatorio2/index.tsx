import React, { useEffect, useRef, useState } from 'react';
import { GetDefinition, GetDefinitionFields, GetRoleAssignments, GetSites } from '../../components/helpers/requests';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const env = 'PROD';

export default function Relatorio2() {

  const [spData, setSpData] = useState({ Definition: undefined, RoleAssignments: undefined, DefinitionFields: undefined, Sites: undefined });
  const [loading, setLoading] = useState(false);
  const toastId = useRef<any>(null);

  useEffect(() => {
    setLoading(true);
    toastId.current = toast.loading('Carregando...', { autoClose: false });

    Promise.all([GetDefinition(env), GetRoleAssignments(env), GetDefinitionFields(env), GetSites(env)])
      .then(responses => {
        const Definition = responses[0].data.value
        const RoleAssignments = responses[1].data.value
        const DefinitionFields = responses[2].data.value
        const Sites = responses[3].data.value

        setSpData({ Definition, RoleAssignments, DefinitionFields, Sites });
      })
      .finally(() => {
        setLoading(false);
        toast.dismiss(toastId.current);
        toastId.current = toast.success('Carregado com sucesso!', { autoClose: 2500 });
      })
  }, []);


  return (
    <div>
      {loading ? 'Carregando...' : null}
      <ToastContainer
        position='top-center'
        theme='dark'
      />
      <pre>
        {JSON.stringify(spData.Sites, null, 2)}
      </pre>
    </div>
  )
}