-- ----- card_price ( 卡價資訊 ) ------
create table card_price
(
  id                bigint                   comment 'ID' auto_increment primary key,
  uuid              varchar(100)             not null  comment 'UUID' unique,
  card_id           varchar(100)             null  comment '卡號',
  card_name         varchar(8000)            null  comment '卡片名稱',
  big_pic           varchar(2000)            null  comment '大圖連結',
  small_pic         varchar(2000)            null  comment '小圖連結',
  buy_link          varchar(2000)            null  comment '購買連結',
  stock             int(20)                  null  comment '庫存量', -- 如果為 -1 代表無限供應
  price             int(50)                  not null  comment '卡片價格',
  currency          varchar(100)             not null  comment '幣別',
  create_at         datetime                 null  comment '預計開桌時間',
  update_at         datetime                 null  comment '預計開桌時間',
)
  comment '卡價資訊';
-- ----- card_price ( 卡價資訊 ) ------
