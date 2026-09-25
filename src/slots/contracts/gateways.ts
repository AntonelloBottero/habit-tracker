import { BaseGateway } from "../../shared/contracts/gateways"
import { type SlotProps } from "../domain/Slot"
import { type SlotRawProps } from "../mappers/SlotMapper"

export type SlotGateway = BaseGateway<SlotRawProps, SlotProps>