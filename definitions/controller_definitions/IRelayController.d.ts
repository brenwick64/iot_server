export interface IRelayController {
    status: string
    type: string

    turn_on: () => void
    turn_off: () => void
    toggle: () => void
    getState: () => Object
}