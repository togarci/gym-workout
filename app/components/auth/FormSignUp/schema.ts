import * as Yup from 'yup';

const signUpFormSchema = Yup.object({
  name: Yup.string().trim(),
  userName: Yup.string().trim().required('Nome de usuário é obrigatório'),
  email: Yup.string().trim().email('E-mail inválido').required('E-mail é obrigatório'),
  password: Yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'As senhas não conferem')
    .required('Confirme a sua senha'),
});

export default signUpFormSchema;
