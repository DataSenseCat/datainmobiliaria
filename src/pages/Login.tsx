import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../lib/api'

export default function Login(){
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async(e:React.FormEvent)=>{
    e.preventDefault()
    try{
      await login(password)
      navigate('/admin')
    }catch(e:any){
      setError('Credenciales inválidas')
    }
  }

  return (
    <div className="max-w-sm mx-auto card p-6">
      <h1 className="text-xl font-semibold mb-4">Acceder</h1>
      <form className="space-y-3" onSubmit={submit}>
        <input type="password" placeholder="Contraseña de administrador" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary w-full">Ingresar</button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  )
}
