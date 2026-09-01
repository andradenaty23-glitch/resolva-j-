import re

# Fix RequestServiceModal
f = 'src/components/RequestServiceModal.tsx'
with open(f, 'r') as file: content = file.read()
content = content.replace("profissionalFoto: servico?.profissionalFoto,", "")
with open(f, 'w') as file: file.write(content)

# Fix ServiceModal
f = 'src/components/ServiceModal.tsx'
with open(f, 'r') as file: content = file.read()
content = content.replace("const [disponivel, setDisponivel] = useState(initialService?.disponivel !== false);", "const [disponivel, setDisponivel] = useState(initialService?.ativo !== false);")
content = content.replace("disponivel", "ativo")
content = content.replace("setDisponivel", "setAtivo")
with open(f, 'w') as file: file.write(content)

# Fix AdminPanelScreen
f = 'src/components/AdminPanelScreen.tsx'
with open(f, 'r') as file: content = file.read()
content = content.replace("id: 'cat-eletrica', ", "")
with open(f, 'w') as file: file.write(content)

# Fix App.tsx
f = 'src/App.tsx'
with open(f, 'r') as file: content = file.read()
# In App.tsx: cancelSolicitacao takes only id now, but maybe it's called with (id, 'cancelada'). 
# Wait, cancelSolicitacao(id). I defined it as `export function cancelSolicitacao(id: string): Promise<void> { ... }`. So it expects 1 arg.
# Where is it called? App.tsx(999,51): cancelSolicitacao(id, 'cancelada') maybe?
content = content.replace("cancelSolicitacao(id, 'cancelada')", "cancelSolicitacao(id)")
content = content.replace("cancelSolicitacao(id, 'cancelada', e)", "cancelSolicitacao(id)")
content = content.replace("cancelSolicitacao(id, 'cancelada', '')", "cancelSolicitacao(id)")
content = re.sub(r"cancelSolicitacao\(([^,]+),\s*'cancelada'\)", r"cancelSolicitacao(\1)", content)
with open(f, 'w') as file: file.write(content)

