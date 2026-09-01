import re

# Fix AdminPanelScreen
f = 'src/components/AdminPanelScreen.tsx'
with open(f, 'r') as file: content = file.read()
content = content.replace("id: generatedId,", "")
with open(f, 'w') as file: file.write(content)

# Fix App.tsx
f = 'src/App.tsx'
with open(f, 'r') as file: content = file.read()
content = content.replace("cancelSolicitacao(id, clientProfile.id)", "cancelSolicitacao(id)")
content = content.replace("cancelSolicitacao(id, providerProfile.id)", "cancelSolicitacao(id)")
with open(f, 'w') as file: file.write(content)

# Fix RequestServiceModal
f = 'src/components/RequestServiceModal.tsx'
with open(f, 'r') as file: content = file.read()
content = content.replace("dataSolicitacao:", "data:")
with open(f, 'w') as file: file.write(content)

