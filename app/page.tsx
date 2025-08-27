"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Heart, AlertTriangle, CheckCircle } from "lucide-react"
import Image from "next/image"

type GameState = {
  currentScene: string
  choices: string[]
  ending: number | null
}

type Scene = {
  id: string
  title: string
  narrator?: string
  character?: string
  dialogue?: string
  choices?: {
    text: string
    nextScene: string
    choiceId: string
  }[]
  isEnding?: boolean
  endingType?: "good" | "warning" | "recovery"
}

const scenes: Scene[] = [
  {
    id: "intro",
    title: "Conhecendo o Joãozinho",
    character: "Joãozinho",
    dialogue: "Oii, eu sou o Joãozinho hoje conto com você para escolher meu caminho!!! vamos lá",
    choices: [
      { text: "ir comer o cachorro-quente", nextScene: "festa", choiceId: "hotdog" },
      { text: "ir jogar com alguns amigos", nextScene: "festa", choiceId: "play" },
      { text: "ficar conversando com os amigos", nextScene: "festa", choiceId: "talk" },
    ],
  },
  {
    id: "festa",
    title: "A Festa do Gui",
    narrator: "Joãozinho está muito animado, pois hoje é a festa de aniversário do seu amigo Gui.",
    character: "Gui",
    dialogue: "E ai João, que bom que veio! já comeu o cachorro-quente ?? Cara ta muito bom !!",
    choices: [{ text: "Ainda não comi cara, já já vou.", nextScene: "festa-later", choiceId: "later" }],
  },
  {
    id: "festa-later",
    title: "Mais tarde na festa...",
    narrator:
      "Rafa, um garoto um pouco mais velho se aproxima da rodinha que Joãozinho estava com um objeto diferente em suas mãos.",
    character: "Joãozinho",
    dialogue: "Ainda não comi cara, já já vou.",
    choices: [{ text: "Continuar", nextScene: "vape-introduction", choiceId: "continue" }],
  },
  {
    id: "vape-introduction",
    title: "O Vape Aparece",
    narrator:
      "João e seus amigos se aproximam curiosos enquanto Rafa pega o aparelho e assopra uma fumaça colorida no ar.",
    character: "Rafa",
    dialogue:
      "E ai pessoal, deixa eu mostrar um negócio massa para vocês!! Isso é um vape!! Querem experimentar? Este tem o sabor melância.",
    choices: [{ text: "Continuar", nextScene: "friends-reaction", choiceId: "continue" }],
  },
  {
    id: "friends-reaction",
    title: "Reação dos Amigos",
    character: "Pedro",
    dialogue: "Hum que cheiro bom! O gosto é igual de melância mesmo?",
    choices: [{ text: "Continuar", nextScene: "laura-warning", choiceId: "continue" }],
  },
  {
    id: "laura-warning",
    title: "Laura Alerta",
    character: "Laura",
    dialogue: "Cai fora Rafa! Isso faz muito mal para saúde.",
    choices: [{ text: "Continuar", nextScene: "rafa-pressure", choiceId: "continue" }],
  },
  {
    id: "rafa-pressure",
    title: "A Pressão do Grupo",
    narrator:
      "Joãozinho olha para os lados e todos da roda estão olhando para ele. Porém ele não quer parecer medroso, mas sabe que o vape não é brinquedo.",
    character: "Rafa",
    dialogue: "Faz nada Laura, todo mundo usa, só você que é medrosa! E você Jão tá com medo também?",
    choices: [
      {
        text: 'Aceita com medo de ser zoado: "Só um pouquinho não faz mal."',
        nextScene: "first-try",
        choiceId: "accept",
      },
      {
        text: 'Recusa: "Não Rafa isso não é brinquedo, faz mal de verdade."',
        nextScene: "refuse-scene",
        choiceId: "refuse",
      },
    ],
  },
  {
    id: "refuse-scene",
    title: "A Recusa Corajosa",
    narrator:
      "Joãozinho resolve sair daquela rodinha e alguns amigos o acompanham, Joãozinho resolve aproveitar a festa de outras maneiras com os amigos.",
    choices: [{ text: "Ver o final", nextScene: "ending-1", choiceId: "see-ending" }],
  },
  {
    id: "first-try",
    title: "A Primeira Tragada",
    narrator: "Assim que traga a primeira vez Joãozinho tosse e seus olhos se enchem de lágrimas.",
    character: "Rafa",
    dialogue: 'É assim mesmo mano logo "cê" se acostuma, é por que foi sua primeira vez relaxa.',
    choices: [
      {
        text: "Joãozinho acha que foi o suficiente o primeiro e último trago e devolve o vape para Rafa.",
        nextScene: "ending-1",
        choiceId: "stop-first",
      },
      {
        text: 'Joãozinho resolve ouvir o rafa e continua usando até se "acostumar".',
        nextScene: "time-passes",
        choiceId: "continue",
      },
    ],
  },
  {
    id: "time-passes",
    title: "Algum tempo depois...",
    narrator:
      "Joãozinho que achou que seria só uma vez usando o vape, acabou se enganando e usando várias outras vezes...",
    choices: [{ text: "Continuar", nextScene: "pe-class", choiceId: "continue" }],
  },
  {
    id: "pe-class",
    title: "Na aula de Educação Física...",
    narrator:
      "Hoje é dia quadra, e o Joãozinho está muito animado, pois vão jogar queimada o seu jogo favorito, mas algo estava diferente.",
    character: "Professora",
    dialogue: "Vamos lá turma, joguem limpo e podem começar.",
    choices: [{ text: "Continuar", nextScene: "feeling-sick", choiceId: "continue" }],
  },
  {
    id: "feeling-sick",
    title: "Sintomas Aparecem",
    narrator:
      "O jogo se inicia e tudo estava indo bem, porém Joãozinho se sente cansado rapidamente, começa sentir sua cabeça girar e sente muita falta de ar.",
    character: "Professora",
    dialogue: "Joãozinho está tudo bem?? Você está muito pálido.",
    choices: [{ text: "Continuar", nextScene: "joao-response", choiceId: "continue" }],
  },
  {
    id: "joao-response",
    title: "Resposta do Joãozinho",
    character: "Joãozinho",
    dialogue: "Estou sim Prof, só um pouco cansado hoje (fala ofegante).",
    narrator:
      "A professora acha estranho o estado de Joãozinho e resolve ligar para seus pais, enquanto isso leva o garoto para a direção.",
    choices: [{ text: "Continuar", nextScene: "parents-arrive", choiceId: "continue" }],
  },
  {
    id: "parents-arrive",
    title: "Os Pais Chegam",
    narrator: "Os pais de Joãozinho chegam rapidamente pois estavam preocupados com o filho.",
    character: "Professora",
    dialogue:
      "Chamei os senhores aqui, pois tem um tempo que percebi que o João está diferente, durante as aulas práticas tem se cansado muito rápido e apresenta tosse frequente seja em sala de aula ou na quadra e anda muito irritado com seus colegas, isso tem me preocupado pois não é um comportamento normal para o João.",
    choices: [{ text: "Continuar", nextScene: "father-speaks", choiceId: "continue" }],
  },
  {
    id: "father-speaks",
    title: "O Pai Fala",
    character: "Pai",
    dialogue:
      "Percebemos um comportamento diferente, mas achamos que fosse apenas uma fase da puberdade, anda acontecendo algo filho? Você pode nos contar, não precisa ter medo.",
    choices: [
      {
        text: "Joãozinho acha que seus pais vão brigar e ele decide não contar, afinal ele pode parar de fumar a qualquer hora...",
        nextScene: "lie-to-parents",
        choiceId: "lie",
      },
      {
        text: "Joãozinho resolve contar para seus pais o que vem acontecendo.",
        nextScene: "tell-truth",
        choiceId: "tell-truth",
      },
    ],
  },
  {
    id: "tell-truth",
    title: "A Confissão",
    character: "Joãozinho",
    dialogue:
      "E-Eu experimentei vape em uma festa e não consegui parar de usar, mesmo que eu queira eu não consigo e não estou me sentindo bem.",
    narrator: "Após a confissão de Joãozinho, seus pais ficaram preocupados e levaram o menino no médico.",
    choices: [{ text: "Continuar", nextScene: "doctor-visit", choiceId: "continue" }],
  },
  {
    id: "doctor-visit",
    title: "No Médico",
    character: "Médico",
    dialogue:
      'Então João, sua mãe me contou o que aconteceu, você reconhecer que errou é o primeiro passo para melhorar, os seus exames mostram uma irritação no pulmão, mas como você veio rápido seu tratamento vai ser mais "simples", porém ainda sim é um tratamento longo.',
    choices: [{ text: "Ver o final", nextScene: "ending-2", choiceId: "see-ending" }],
  },
  {
    id: "lie-to-parents",
    title: "A Mentira",
    character: "Joãozinho",
    dialogue:
      "Não está acontecendo nada, apenas estou cansado esses dias e acho que posso estar ficando gripado, só preciso descansar um pouco.",
    narrator:
      "Após a mentira de Joãozinho seus pais resolvem ir embora mas prometem para a professora que irão ficar de olho nele. Joãozinho com medo pensa se deveria parar de fumar o vape pelo menos por um tempo até melhorar ou até que seus pais parem de desconfiar dele.",
    choices: [
      {
        text: "Joãozinho resolve parar de fumar...pelo menos por um tempo.",
        nextScene: "try-to-stop",
        choiceId: "try-stop",
      },
      {
        text: "João acha que seus pais não vão desconfiar e que ele não está tão mal quanto a professora fez parecer.",
        nextScene: "continue-using",
        choiceId: "continue-using",
      },
    ],
  },
  {
    id: "try-to-stop",
    title: "Tentativa de Parar",
    narrator:
      "Joãozinho tenta ficar sem o vape, porém começa a sentir fortes dores de cabeça e se sente muito mais ansioso ao mesmo tempo que tudo o irrita e no fim Joãozinho percebe que não consegue ficar sem seu pod por muito tempo e retorna ao velho hábito.",
    choices: [{ text: "Continuar", nextScene: "much-later", choiceId: "continue" }],
  },
  {
    id: "continue-using",
    title: "Continuando o Uso",
    narrator: "Joãozinho continua usando o vape, ignorando os sinais que seu corpo está dando.",
    choices: [{ text: "Continuar", nextScene: "much-later", choiceId: "continue" }],
  },
  {
    id: "much-later",
    title: "Muito tempo depois...",
    narrator: "Joãozinho continuou com seu hábito de fumar, e seus sintomas pioraram cada vez mais.",
    choices: [{ text: "Continuar", nextScene: "crisis-begins", choiceId: "continue" }],
  },
  {
    id: "crisis-begins",
    title: "A Crise Começa",
    narrator:
      "Um dia em seu quarto Joãozinho sente uma pontada no peito e sua respiração fica pesada e rápida, ele senta na cama sentindo sua cabeça pesada e começa a tossir sem parar.",
    character: "Joãozinho",
    dialogue: "O que tá acontecendo comigo? (fala em meio a tosse)",
    choices: [{ text: "Continuar", nextScene: "mother-enters", choiceId: "continue" }],
  },
  {
    id: "mother-enters",
    title: "A Mãe Entra",
    narrator:
      "A mãe de Joãozinho entra no quarto apressada por ouvir a tosse contínua do filho e se assusta com a aparência pálida do menino.",
    character: "Joãozinho",
    dialogue: "Mãe .... meu peito dói....não consigo respirar.",
    choices: [{ text: "Continuar", nextScene: "mother-panic", choiceId: "continue" }],
  },
  {
    id: "mother-panic",
    title: "Desespero da Mãe",
    character: "Mãe",
    dialogue: "Meu Deus filho!!!! (fala assustada)",
    narrator: "A mãe de Joãozinho desesperada liga para o serviço de emergência.",
    choices: [{ text: "Continuar", nextScene: "hospital", choiceId: "continue" }],
  },
  {
    id: "hospital",
    title: "No Hospital",
    narrator: "Após ser atendido o médico se aproxima de Joãozinho e de seus pais.",
    character: "Médico",
    dialogue:
      "Bom o João teve uma crise de broncoespasmo, os pulmões dele estão inflamados...(suspira). Isso se deve ao uso contínuo de cigarros eletrônicos...",
    choices: [{ text: "Continuar", nextScene: "mother-question", choiceId: "continue" }],
  },
  {
    id: "mother-question",
    title: "Pergunta da Mãe",
    character: "Mãe",
    dialogue: "Mas ele é tão novo doutor !! Como pode ter tido uma crise tão grave?",
    character: "Médico",
    dialogue:
      "Justamente por ele ser novo que o risco é maior, os pulmões dele ainda estão se desenvolvendo, se ele continuar com o uso dos cigarros eletrônicos pode acontecer quadros ainda piores.....",
    choices: [{ text: "Continuar", nextScene: "joao-regret", choiceId: "continue" }],
  },
  {
    id: "joao-regret",
    title: "Arrependimento",
    narrator: "A mãe de Joãozinho segura em sua mão tentando confortar o garoto.",
    character: "Joãozinho",
    dialogue: "Eu... não queria que chegasse a isso.... eu só ...",
    choices: [{ text: "Continuar", nextScene: "doctor-advice", choiceId: "continue" }],
  },
  {
    id: "doctor-advice",
    title: "Conselho Médico",
    character: "Médico",
    dialogue:
      "João nosso corpo grita quando precisa de ajuda, esse é o grito do seu corpo, precisamos que você esteja disposto a encarar esse tratamento contra o vape.",
    choices: [{ text: "Continuar", nextScene: "recovery-journey", choiceId: "continue" }],
  },
  {
    id: "recovery-journey",
    title: "A Jornada de Recuperação",
    narrator:
      "Após a consulta João deu início ao tratamento, jogou seu vape fora e começou a ir à psicóloga, o tratamento não foi fácil teve crises, ficou irritado e pensou até em desistir mas graças ao apoio que recebeu de seus pais, amigos, professores e a psicóloga conseguiu vencer essa luta contra o pod. João se sente envergonhado, mas sabe que precisa se cuidar afinal o susto que teve o fez repensar no uso do vape.",
    choices: [{ text: "Ver o final", nextScene: "ending-3", choiceId: "see-ending" }],
  },
  {
    id: "ending-1",
    title: "Final Consciente",
    narrator:
      "Parabéns! Este é o final 1/3 - Este é o final consciente!!! Você teve uma boa escolha mas será que você consegue os outros finais?",
    isEnding: true,
    endingType: "good",
  },
  {
    id: "ending-2",
    title: "Final da Recuperação",
    narrator:
      "Parabéns! Este é o final 2/3 - Pedir ajuda não é um sinal de fraqueza e sim de força!!! Você teve escolhas ruins mas se redimiu no fim, mas será que você consegue os outros finais?",
    isEnding: true,
    endingType: "recovery",
  },
  {
    id: "ending-3",
    title: "Final da Superação",
    narrator:
      "Parabéns! Este é o final 3/3 - Superar um erro não é fácil, mas é possível!!! Você teve escolhas ruins mas se redimiu no fim, mas será que você consegue os outros finais?",
    isEnding: true,
    endingType: "warning",
  },
]

export default function VapeAwarenessGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentScene: "intro",
    choices: [],
    ending: null,
  })

  const currentScene = scenes.find((scene) => scene.id === gameState.currentScene)

  const makeChoice = (choice: { text: string; nextScene: string; choiceId: string }) => {
    const newChoices = [...gameState.choices, choice.choiceId]

    setGameState({
      currentScene: choice.nextScene,
      choices: newChoices,
      ending: scenes.find((s) => s.id === choice.nextScene)?.isEnding
        ? choice.nextScene === "ending-1"
          ? 1
          : choice.nextScene === "ending-2"
            ? 2
            : 3
        : null,
    })
  }

  const restartGame = () => {
    setGameState({
      currentScene: "intro",
      choices: [],
      ending: null,
    })
  }

  const getEndingIcon = (type?: string) => {
    switch (type) {
      case "good":
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case "recovery":
        return <Heart className="w-8 h-8 text-blue-500" />
      case "warning":
        return <AlertTriangle className="w-8 h-8 text-orange-500" />
      default:
        return null
    }
  }

  const getEndingColor = (type?: string) => {
    switch (type) {
      case "good":
        return "border-green-200 bg-green-50"
      case "recovery":
        return "border-blue-200 bg-blue-50"
      case "warning":
        return "border-orange-200 bg-orange-50"
      default:
        return "border-gray-200 bg-white"
    }
  }

  if (!currentScene) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">O Perigo Invisível dos Vapes</h1>
          <p className="text-lg text-gray-600">
            Conscientização sobre o impacto no uso de cigarros eletrônicos na saúde dos Jovens
          </p>
          {gameState.ending && (
            <Badge variant="secondary" className="mt-2">
              Final {gameState.ending}/3 Desbloqueado
            </Badge>
          )}
        </div>

        {/* Game Content */}
        <Card className={`mb-6 ${currentScene.isEnding ? getEndingColor(currentScene.endingType) : "bg-white"}`}>
          <CardContent className="p-8">
            {/* Scene Title */}
            <div className="flex items-center gap-3 mb-6">
              {currentScene.isEnding && getEndingIcon(currentScene.endingType)}
              <h2 className="text-2xl font-bold text-gray-800">{currentScene.title}</h2>
            </div>

            {/* Narrator Text */}
            {currentScene.narrator && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                <p className="text-gray-700 italic">
                  <strong>Narrador:</strong> {currentScene.narrator}
                </p>
              </div>
            )}

            {/* Character Dialogue */}
            {currentScene.character && currentScene.dialogue && (
              <div className="mb-6">
                {currentScene.character === "Joãozinho" ? (
                  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex-shrink-0 self-start">
                      <Image
                        src="/joaozinho.png"
                        alt="Joãozinho"
                        width={80}
                        height={120}
                        className="w-16 h-24 sm:w-20 sm:h-30 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-800">
                        <strong>{currentScene.character}:</strong> {currentScene.dialogue}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-blue-800">
                      <strong>{currentScene.character}:</strong> {currentScene.dialogue}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Choices */}
            {currentScene.choices && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  {currentScene.choices.length > 1 ? "Escolha o caminho do Joãozinho:" : ""}
                </h3>
                {currentScene.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => makeChoice(choice)}
                    variant="outline"
                    className="w-full text-left p-4 h-auto whitespace-normal hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            )}

            {/* Ending Actions */}
            {currentScene.isEnding && (
              <div className="mt-6 text-center">
                <Button onClick={restartGame} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Jogar Novamente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        {!currentScene.isEnding && (
          <div className="text-center text-sm text-gray-500">Cenas percorridas: {gameState.choices.length + 1}</div>
        )}

        {/* Educational Footer */}
        <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-800 mb-2">Importante: Este é um jogo educativo</h3>
              <p className="text-red-700 text-sm">
                Os vapes e pods contêm nicotina e outras substâncias químicas que podem causar dependência e sérios
                problemas de saúde, especialmente em jovens. Se você ou alguém que conhece está enfrentando problemas
                com o uso de cigarros eletrônicos, procure ajuda médica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
