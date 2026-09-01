import os
import re

db_file = 'src/services/firebaseDatabase.ts'
with open(db_file, 'a') as f:
    f.write("\n")
    f.write("export async function addCategoria(cat: Omit<CategoriaDoc, 'id' | 'criadoEm'>): Promise<string> {\n")
    f.write("  const id = `cat-${Date.now()}`;\n")
    f.write("  await setDoc(doc(db, 'categorias', id), { ...cat, id, criadoEm: new Date().toISOString() });\n")
    f.write("  return id;\n")
    f.write("}\n")
    f.write("export async function seedDefaultCategoriasIfEmpty(): Promise<void> {\n")
    f.write("  const q = query(collection(db, 'categorias'), limit(1));\n")
    f.write("  const snap = await getDocs(q);\n")
    f.write("  if (snap.empty) {\n")
    f.write("    await addCategoria({ nome: 'Elétrica', ativa: true });\n")
    f.write("  }\n")
    f.write("}\n")
    f.write("export function subscribeSolicitacoesCliente(uid: string, cb: (s: SolicitacaoDoc[]) => void) {\n")
    f.write("  return subscribeSolicitacoes(uid, 'cliente', cb);\n")
    f.write("}\n")
    f.write("export function subscribeSolicitacoesProfissional(uid: string, cb: (s: SolicitacaoDoc[]) => void) {\n")
    f.write("  return subscribeSolicitacoes(uid, 'profissional', cb);\n")
    f.write("}\n")
    f.write("export function cancelSolicitacao(id: string): Promise<void> {\n")
    f.write("  return updateSolicitacaoStatus(id, 'cancelada');\n")
    f.write("}\n")

with open(db_file, 'r') as f:
    content = f.read()

content = content.replace("tipo?: 'info' | 'sucesso' | 'alerta' | 'erro'", "tipo?: 'info' | 'sucesso' | 'alerta' | 'erro' | 'success' | 'alert' | 'warning'")
with open(db_file, 'w') as f:
    f.write(content)

