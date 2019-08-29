type IEvent = [string, ...any[]]

interface IEffectResult<T> {
  db?: T
  [key: string]: any
}
interface IEventContext<T> {
  db: T
  [key: string]: any
}

type EventDBHandler<T> = (db: T, event: IEvent) => T
type EventFXHandler<T> = (
  ctx: IEventContext<T>,
  event: IEvent
) => IEffectResult<T>

interface RegisterEvent<T> {
  (id: string, handler: EventDBHandler<T>): void
  fx(id: string, handler: EventFXHandler<T>): void
}

export interface IStore {
  event: RegisterEvent<T>
  dispatch(event: IEvent): void
  dispatchSync(event: IEvent): void
}

export type createStore<T> = () => IStore<T>
