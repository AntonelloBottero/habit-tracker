import { DexieBaseGateway } from "@/src/shared/infrastructure/gateways"
import { EventMapper, EventRawProps } from "../mappers/EventMapper"
import { EventProps } from "../domain/Event"
import { EventGateway } from "../contracts/gateways"
import Dexie from "dexie"

export class DexieEventGateway extends DexieBaseGateway<EventRawProps, EventProps> implements EventGateway {
    constructor(db: Dexie) {
        super(db, 'event', new EventMapper())
    }
}