import { useEffect, useState, type ReactNode } from 'react'
import { titles } from './config'
import { Atmosphere, FinaleHearts } from './components/Hearts'
import { Background } from './components/Background'
import { Progress } from './components/Progress'
import { StageTransition } from './components/StageTransition'
import { GateStage } from './stages/GateStage'
import { InvalidStage } from './stages/InvalidStage'
import { LoaderStage } from './stages/LoaderStage'
import { StageFive } from './stages/StageFive'
import { StageFour } from './stages/StageFour'
import { StageOne } from './stages/StageOne'
import { StageThree } from './stages/StageThree'
import { StageTwo } from './stages/StageTwo'
import type { Invitation, Stage } from './types'

const pageTitles = titles as Record<string, string>

const emptyForm: Invitation = {
  name: 'Kay',
  dob: '',
  dateType: null,
  dateTime: '',
  phone: '',
}

export default function App() {
  const [stage, setStage] = useState<Stage>('loading')
  const [form, setForm] = useState<Invitation>(emptyForm)

  useEffect(() => {
    document.title = pageTitles[String(stage)] ?? 'Hangout Invitation'
  }, [stage])

  const patch = (partial: Partial<Invitation>, next: Stage) => {
    setForm((current) => ({ ...current, ...partial }))
    setStage(next)
  }

  let screen: ReactNode = null
  if (stage === 'loading') screen = <LoaderStage onDone={() => setStage('gate')} />
  else if (stage === 'gate') {
    screen = (
      <GateStage
        initialName={form.name}
        initialDob={form.dob}
        onSubmit={(name, dob, valid) => patch({ name, dob }, valid ? 1 : 'invalid')}
      />
    )
  } else if (stage === 'invalid') screen = <InvalidStage onRetry={() => setStage('gate')} />
  else if (stage === 1) screen = <StageOne name={form.name} onYes={() => setStage(2)} />
  else if (stage === 2) screen = <StageTwo onNext={(dateType) => patch({ dateType }, 3)} />
  else if (stage === 3) screen = <StageThree onNext={(dateTime) => patch({ dateTime }, 4)} />
  else if (stage === 4) screen = <StageFour form={form} onSuccess={(phone) => patch({ phone }, 5)} />
  else if (stage === 5) screen = <StageFive form={form} />

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <Background />
      <Atmosphere />
      {stage === 5 ? <FinaleHearts /> : null}
      {typeof stage === 'number' ? <Progress current={stage} /> : null}
      <StageTransition stage={stage}>{screen}</StageTransition>
    </div>
  )
}
