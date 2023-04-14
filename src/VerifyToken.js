import api from "./service/Service";

export async function verifyToken() {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('autenticacao/verifyToken', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        return {valid_token: res.data.validToken, user : res.data.user, tipoUser: res.data.tipoUser}
      } else{
        return {valid_token: false, user: '', tipoUser: ''}
      }
    } catch (error) {
      localStorage.removeItem('token');
        return {valid_token: false, user: '', tipoUser: ''}
    }
}
