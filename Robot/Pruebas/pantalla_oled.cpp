#include <U8g2lib.h>
#include <SPI.h>

// Pines
#define PIN_SCK  12
#define PIN_MOSI 11
#define PIN_CS   8
#define PIN_DC   9
#define PIN_RES  10

U8G2_SSDD1306_128X64_NONAME_1_4W_HW_SPI u8g2(U8G2_R0, PIN_CS, PIN_DC, PIN_RES);

void setup() {
  Serial.begin(115200);
  u8g2.begin();
}

void loop() {
  u8g2.firstPage();
  do {
    u8g2.clearBuffer();
    u8g2.drawStr(10, 20, "Hola Mundo");
  } while (u8g2.nextPage());
  delay(1000);
}
