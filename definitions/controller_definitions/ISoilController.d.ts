export interface ISoilController {
    type: string
    soilStatus: string

    request_data: () => void
    set_soil_status: (status: string) => void
    getState: () => Object
}