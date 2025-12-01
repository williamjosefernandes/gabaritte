import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Calendar, FileText, Trash2, Edit, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { mockSubjects, activePlan } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Mock initial data for Mock Exams (Simulados)
const initialMockExams = [
  {
    id: 1,
    title: "Simulado OAB 1ª Fase",
    date: "2024-11-15",
    type: "Completo",
    totalQuestions: 80,
    correctAnswers: 48,
    score: 60, // Percentage
    details: [
      { subjectId: 1, subjectName: "Ética Profissional", questions: 8, correct: 6 },
      { subjectId: 2, subjectName: "Direito Constitucional", questions: 7, correct: 4 },
    ]
  },
  {
    id: 2,
    title: "Mini-Simulado Direito Administrativo",
    date: "2024-11-20",
    type: "Parcial",
    totalQuestions: 20,
    correctAnswers: 15,
    score: 75,
    details: [
      { subjectId: 4, subjectName: "Direito Administrativo", questions: 20, correct: 15 }
    ]
  }
];

export default function Simulados() {
  const [mockExams, setMockExams] = useState(initialMockExams);
  const [isNewExamOpen, setIsNewExamOpen] = useState(false);
  const [expandedExam, setExpandedExam] = useState<number | null>(null);

  // New Exam Form State
  const [newExamTitle, setNewExamTitle] = useState("");
  const [newExamDate, setNewExamDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [newExamType, setNewExamType] = useState<"Completo" | "Parcial">("Completo");
  const [editingExamId, setEditingExamId] = useState<number | null>(null);
  
  // Dynamic Rows for Results
  const [resultRows, setResultRows] = useState<Array<{
    subjectId: string,
    topicId: string, 
    subtopicId: string,
    questions: number,
    correct: number
  }>>([{ subjectId: "", topicId: "", subtopicId: "", questions: 0, correct: 0 }]);

  const handleAddRow = () => {
    setResultRows([...resultRows, { subjectId: "", topicId: "", subtopicId: "", questions: 0, correct: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = [...resultRows];
    newRows.splice(index, 1);
    setResultRows(newRows);
  };

  const updateRow = (index: number, field: keyof typeof resultRows[0], value: any) => {
    const newRows = [...resultRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setResultRows(newRows);
  };

  const handleSaveExam = () => {
    if (!newExamTitle || !newExamDate) return;

    const totalQ = resultRows.reduce((acc, row) => acc + Number(row.questions), 0);
    const totalC = resultRows.reduce((acc, row) => acc + Number(row.correct), 0);
    const score = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

    const examDetails = resultRows.map(row => {
      const subject = mockSubjects.find(s => s.id.toString() === row.subjectId);
      const topic = subject?.topics.find(t => t.id.toString() === row.topicId);
      const subtopic = topic?.subtopics.find(st => st.id.toString() === row.subtopicId);
      
      let name = subject ? subject.name : "Desconhecido";
      if (topic) name += ` > ${topic.name}`;
      if (subtopic) name += ` > ${subtopic.name}`;

      return {
        subjectId: Number(row.subjectId),
        subjectName: name,
        topicId: row.topicId ? row.topicId : undefined,
        subtopicId: row.subtopicId ? row.subtopicId : undefined,
        questions: Number(row.questions),
        correct: Number(row.correct)
      };
    });

    if (editingExamId) {
      setMockExams(mockExams.map(exam => {
        if (exam.id === editingExamId) {
          return {
            ...exam,
            title: newExamTitle,
            date: newExamDate,
            type: newExamType,
            totalQuestions: totalQ,
            correctAnswers: totalC,
            score: score,
            details: examDetails
          };
        }
        return exam;
      }));
    } else {
      const newExam = {
        id: Date.now(),
        title: newExamTitle,
        date: newExamDate,
        type: newExamType,
        totalQuestions: totalQ,
        correctAnswers: totalC,
        score: score,
        details: examDetails
      };
      setMockExams([newExam, ...mockExams]);
    }

    setIsNewExamOpen(false);
    resetForm();
  };

  const handleEditExam = (exam: any) => {
    setEditingExamId(exam.id);
    setNewExamTitle(exam.title);
    setNewExamDate(exam.date);
    setNewExamType(exam.type);
    
    // Populate rows based on details
    // Note: existing mock data might not have IDs, so we fallback gracefully
    const rows = exam.details.map((detail: any) => ({
      subjectId: detail.subjectId.toString(),
      topicId: detail.topicId || "",
      subtopicId: detail.subtopicId || "",
      questions: detail.questions,
      correct: detail.correct
    }));
    
    setResultRows(rows.length > 0 ? rows : [{ subjectId: "", topicId: "", subtopicId: "", questions: 0, correct: 0 }]);
    setIsNewExamOpen(true);
  };

  const handleDeleteExam = (id: number) => {
    setMockExams(mockExams.filter(e => e.id !== id));
  };

  const resetForm = () => {
    setNewExamTitle("");
    setNewExamDate(format(new Date(), "yyyy-MM-dd"));
    setNewExamType("Completo");
    setResultRows([{ subjectId: "", topicId: "", subtopicId: "", questions: 0, correct: 0 }]);
    setEditingExamId(null);
  };

  const toggleExpand = (id: number) => {
    if (expandedExam === id) {
      setExpandedExam(null);
    } else {
      setExpandedExam(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Simulados</h2>
          <p className="text-muted-foreground">Registre suas provas externas para calibrar o cronograma.</p>
        </div>
        <Button onClick={() => setIsNewExamOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Simulado
        </Button>
      </div>

      <div className="grid gap-4">
        {mockExams.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum simulado registrado</h3>
            <p>Adicione provas realizadas fora da plataforma para melhorar as recomendações.</p>
          </div>
        ) : (
          mockExams.map((exam) => (
            <Card key={exam.id} className="overflow-hidden border-l-4 border-l-primary">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{exam.title}</h3>
                      <Badge variant="outline" className="font-normal text-xs">
                        {exam.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(exam.date), "dd/MM/yyyy")}
                      </div>
                      <div>
                        {exam.totalQuestions} Questões
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">Nota Final</p>
                      <div className={cn(
                        "text-2xl font-bold",
                        exam.score >= 80 ? "text-green-600" : 
                        exam.score >= 60 ? "text-amber-600" : "text-red-600"
                      )}>
                        {exam.score}%
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toggleExpand(exam.id)}>
                        {expandedExam === exam.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={() => handleEditExam(exam)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteExam(exam.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {expandedExam === exam.id && (
                  <div className="mt-6 pt-4 border-t animate-in slide-in-from-top-2 duration-200">
                    <h4 className="text-sm font-semibold mb-3">Desempenho por Disciplina</h4>
                    <div className="space-y-3">
                      {exam.details.map((detail, idx) => {
                        const percent = Math.round((detail.correct / detail.questions) * 100);
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{detail.subjectName}</span>
                              <span className={cn(
                                "font-medium",
                                percent >= 80 ? "text-green-600" : 
                                percent >= 60 ? "text-amber-600" : "text-red-600"
                              )}>
                                {detail.correct}/{detail.questions} ({percent}%)
                              </span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  percent >= 80 ? "bg-green-500" : 
                                  percent >= 60 ? "bg-amber-500" : "bg-red-500"
                                )}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        O algoritmo do Cronograma Inteligente usará esses dados para ajustar suas próximas revisões, priorizando as matérias com menor desempenho.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* New Exam Dialog */}
      <Dialog open={isNewExamOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsNewExamOpen(open);
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white text-slate-900 border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{editingExamId ? "Editar Simulado" : "Registrar Novo Simulado"}</DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingExamId ? "Atualize os dados da sua prova." : "Lance os resultados da sua prova para análise de desempenho."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700">Título do Simulado</Label>
                <Input 
                  placeholder="Ex: Prova TRF-3 2024" 
                  value={newExamTitle}
                  onChange={(e) => setNewExamTitle(e.target.value)}
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Data de Realização</Label>
                <Input 
                  type="date" 
                  value={newExamDate}
                  onChange={(e) => setNewExamDate(e.target.value)}
                  className="bg-white border-slate-200 text-slate-900 focus-visible:ring-slate-400"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-700">Tipo de Prova</Label>
              <Select value={newExamType} onValueChange={(v: any) => setNewExamType(v)}>
                <SelectTrigger className="bg-white border-slate-200 text-slate-900 focus:ring-slate-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-900">
                  <SelectItem value="Completo" className="focus:bg-slate-100 focus:text-slate-900">Simulado Completo (Todas as matérias)</SelectItem>
                  <SelectItem value="Parcial" className="focus:bg-slate-100 focus:text-slate-900">Simulado Parcial / Lista de Questões</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Results Entry */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700">Resultados por Matéria</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddRow} className="gap-1 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                  <Plus className="w-3 h-3" /> Adicionar Matéria
                </Button>
              </div>
              
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50 border-b-slate-200">
                      <TableHead className="w-[200px] text-slate-600">Disciplina</TableHead>
                      <TableHead className="w-[200px] text-slate-600">Tópico / Subtópico (Opcional)</TableHead>
                      <TableHead className="w-[100px] text-slate-600">Questões</TableHead>
                      <TableHead className="w-[100px] text-slate-600">Acertos</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultRows.map((row, index) => {
                      const selectedSubject = mockSubjects.find(s => s.id.toString() === row.subjectId);
                      const selectedTopic = selectedSubject?.topics.find(t => t.id.toString() === row.topicId);

                      return (
                      <TableRow key={index} className="border-b-slate-100 hover:bg-slate-50">
                        <TableCell>
                          <Select 
                            value={row.subjectId} 
                            onValueChange={(v) => {
                              // Reset topic and subtopic when subject changes
                              const newRows = [...resultRows];
                              newRows[index] = { ...newRows[index], subjectId: v, topicId: "", subtopicId: "" };
                              setResultRows(newRows);
                            }}
                          >
                            <SelectTrigger className="h-8 bg-white border-slate-200 text-slate-900 focus:ring-slate-400">
                              <SelectValue placeholder="Selecione a Matéria" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-900 max-h-[200px]">
                              {mockSubjects.map(s => (
                                <SelectItem key={s.id} value={s.id.toString()} className="focus:bg-slate-100 focus:text-slate-900">{s.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Select 
                              value={row.topicId} 
                              disabled={!row.subjectId}
                              onValueChange={(v) => {
                                // Reset subtopic when topic changes
                                const newRows = [...resultRows];
                                newRows[index] = { ...newRows[index], topicId: v, subtopicId: "" };
                                setResultRows(newRows);
                              }}
                            >
                              <SelectTrigger className="h-8 bg-white border-slate-200 text-slate-900 focus:ring-slate-400 disabled:opacity-50 disabled:bg-slate-50">
                                <SelectValue placeholder="Tópico (Todos)" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-slate-200 text-slate-900 max-h-[200px]">
                                <SelectItem value="all" className="focus:bg-slate-100 focus:text-slate-900">Todos os Tópicos</SelectItem>
                                {selectedSubject?.topics.map(t => (
                                  <SelectItem key={t.id} value={t.id.toString()} className="focus:bg-slate-100 focus:text-slate-900">{t.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {row.topicId && row.topicId !== "all" && (
                              <Select 
                                value={row.subtopicId} 
                                disabled={!row.topicId}
                                onValueChange={(v) => updateRow(index, 'subtopicId', v)}
                              >
                                <SelectTrigger className="h-8 bg-white border-slate-200 text-slate-900 focus:ring-slate-400 disabled:opacity-50 disabled:bg-slate-50">
                                  <SelectValue placeholder="Subtópico (Todos)" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900 max-h-[200px]">
                                  <SelectItem value="all" className="focus:bg-slate-100 focus:text-slate-900">Todos os Subtópicos</SelectItem>
                                  {selectedTopic?.subtopics.map(st => (
                                    <SelectItem key={st.id} value={st.id.toString()} className="focus:bg-slate-100 focus:text-slate-900">{st.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <Input 
                            type="number" 
                            className="h-8 bg-white border-slate-200 text-slate-900 focus-visible:ring-slate-400" 
                            min="0"
                            value={row.questions}
                            onChange={(e) => updateRow(index, 'questions', e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <Input 
                            type="number" 
                            className="h-8 bg-white border-slate-200 text-slate-900 focus-visible:ring-slate-400" 
                            min="0"
                            max={row.questions}
                            value={row.correct}
                            onChange={(e) => updateRow(index, 'correct', e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRemoveRow(index)}
                            disabled={resultRows.length === 1}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewExamOpen(false)} className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900">Cancelar</Button>
            <Button onClick={handleSaveExam} className="bg-slate-900 text-white hover:bg-slate-800">Salvar Resultados</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
