/** 查出的卡片資訊 */
export interface CardInfo {

    /** id - 編號 */
    id?: number;

    /** uuid : must be uuidV4 or uuidV6 format */
    uuid?: string;

    /** 卡號 : 例如 SD63-X001 */
    card_id?: string;

    /** 卡名 */
    card_name?: string;

    /** 大圖連結 : must be http link */
    big_pic?: string;

    /** 小圖連結 : must be http link */
    small_pic?: string;

    /** 購買連結 : must be http link */
    buy_link?: string;

    /** 可購買數量 : -1 代表無限 */
    stock?: number | string;

    /** 價格 : 可能是日幣的價格 */
    price?: number;

    /** 幣別 : TWD . JYP ... */
    currency?: string;

    /** 建立時間 */
    create_at?: Date;

    /** 最後修改時間 */
    update_at?: Date;
}

/** 兌換的匯率 */
export interface Exchange {

    /** 匯率 : 多少 = 1 台幣 */
    rate?: number | '-';

    /** 幣別 : TWD . JYP ... */
    currency?: string;
}
