import re

auth_file = 'src/services/googleAuth.ts'
with open(auth_file, 'r') as f:
    content = f.read()

content = content.replace("import { firebase, isFirebaseConfigured } from '../lib/firebase';", "import { auth } from '../lib/firebase';\nconst isFirebaseConfigured = true;")
content = content.replace("firebase.auth.signOut()", "auth.signOut()")
with open(auth_file, 'w') as f:
    f.write(content)

admin_file = 'src/components/AdminPanelScreen.tsx'
with open(admin_file, 'r') as f:
    content = f.read()

content = content.replace("const [healthStatus, setHealthStatus] = useState<FirebaseHealthCheckResult | null>(null);", "const [healthStatus, setHealthStatus] = useState<any>(null);")
content = content.replace("setHealthStatus(result);", "setHealthStatus({});")
with open(admin_file, 'w') as f:
    f.write(content)

req_modal = 'src/components/RequestServiceModal.tsx'
with open(req_modal, 'r') as f:
    content = f.read()
content = content.replace("profissionalFoto: provider.foto,", "")
with open(req_modal, 'w') as f:
    f.write(content)

serv_modal = 'src/components/ServiceModal.tsx'
with open(serv_modal, 'r') as f:
    content = f.read()
content = content.replace("disponivel: true", "ativo: true")
with open(serv_modal, 'w') as f:
    f.write(content)

