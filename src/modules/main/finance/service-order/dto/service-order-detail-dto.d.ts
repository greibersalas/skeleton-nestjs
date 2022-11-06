export interface ServiceOrderDetailDto {
    id: number;
    idserviceorder: number;
    idtariff: number;
    idcoin: number;
    quantity: number;
    price: number;
    total: number;
    idorigin: number;
    state: number;
    tariff?: string;
    coin?: string;
    check?: boolean;
}