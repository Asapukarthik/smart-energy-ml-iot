export interface SensorData {

    _id?: string
    userId?: string
    temperature: number
    humidity: number
    voltage: number
    ledCurrent: number
    motorCurrent: number
    ledPower: number
    motorPower: number
    occupancy: number
    lightStatus: boolean
    fanStatus: boolean
    timestamp: string | Date

}

export interface DeviceStatus {

    _id?: string
    userId?: string
    light: boolean
    fan: boolean
    updatedAt?: string | Date

}
