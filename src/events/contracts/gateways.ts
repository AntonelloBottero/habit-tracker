import { BaseGateway } from "@/src/shared/contracts/gateways"
import { EventRawProps } from "../mappers/EventMapper"
import { EventProps } from "../domain/Event"

export type EventGateway = BaseGateway<EventRawProps, EventProps> & {
    findOverlapping: (habitId: string | number, date: Date, habitIdToExclude?: string | number) => Promise<EventProps | null>
}