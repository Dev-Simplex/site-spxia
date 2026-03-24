-- Função RPC para admin trocar senha de qualquer usuário diretamente
-- Requer que o chamador seja admin (verificado dentro da função)

CREATE OR REPLACE FUNCTION change_user_password(target_user_id uuid, new_password text)
RETURNS json AS $$
DECLARE
  caller_role text;
BEGIN
  -- Verificar se quem chamou é admin
  SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  IF caller_role IS DISTINCT FROM 'admin' THEN
    RETURN json_build_object('error', 'Apenas administradores podem alterar senhas.');
  END IF;

  -- Validar senha mínima
  IF length(new_password) < 6 THEN
    RETURN json_build_object('error', 'A senha deve ter no mínimo 6 caracteres.');
  END IF;

  -- Atualizar senha direto na tabela auth.users
  UPDATE auth.users
  SET encrypted_password = crypt(new_password, gen_salt('bf')),
      updated_at = now()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Usuário não encontrado.');
  END IF;

  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
