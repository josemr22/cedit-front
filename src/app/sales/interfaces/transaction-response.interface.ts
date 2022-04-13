export interface TransactionResponse {
    'ok': boolean,
    'transaction': Transaction,
    'sunat_response': SunatResponse | null,
}

export interface Transaction {
    voucher_type: string,
    voucher_link: string,
    user_id: number,
    bank_id: number,
    voucher: string,
    voucher_state: string | null,
    updated_at: string,
    created_at: string,
    id: number
}

export interface SunatResponse {
    "IND_OPERACION": string,
    "SUNAT_CODIGO_RESPUESTA": string,
    "SUNAT_DESCRIPCION": string | null,
    "SUNAT_ID_REFERENCIA": string
}