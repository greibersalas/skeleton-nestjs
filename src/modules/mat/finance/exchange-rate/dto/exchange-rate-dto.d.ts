export interface ExchangeRateDto {
    id: number;
    value: number;
    date: string;
    state: number;
    idcoin: number;
    coin: string;
    idexchangehouse: number;
    exchangehouse: string;
}