#include <stdio.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "esp_log.h"

#include "driver/gpio.h"

#include "esp_adc/adc_oneshot.h"

#define ECG_PIN ADC_CHANNEL_3      // GPIO4
#define ECG_UNIT ADC_UNIT_1
#define LO_PLUS GPIO_NUM_17
#define LO_MINUS GPIO_NUM_16
#define LED_PIN GPIO_NUM_2

static const char *TAG = "LED";

void app_main(void)
{
    gpio_config led_config ={
        .pin_bit_mask =  {1ULL << LED_PIN},,
        .mode = GPIO_MODE_OUPUT,
        .pull_up_en = GPIO_PULLUO_DISABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE
    };
    gpio_config_t io_conf = {
        .pin_bit_mask = (1ULL << LO_PLUS || 1ULL << LO_MINUS),
        .mode = GPIO_MODE_INPUT,
        .pull_up_en = GPIO_PULLUP_DISABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE
    };

    gpio_config(&io_conf);

    adc_oneshot_unit_handle_t adc_handle;

    adc_oneshot_unit_init_cfg_t init_config = {
        .unit_id = ECG_UNIT
    };

    ESP_ERROR_CHECK(adc_oneshot_new_unit(&init_config, &adc_handle));

    adc_oneshot_chan_cfg_t config = {
        .bitwidth = ADC_BITWIDTH_12,
        .atten = ADC_ATTEN_DB_12
    };

    ESP_ERROR_CHECK(
        adc_oneshot_config_channel(
            adc_handle,
            ECG_PIN,
            &config
        )
    );

    ESP_LOGI(TAG, "LED iniciado");
    bool led_ecendido = false;
    int time_interval = 500;

    while (1)
    {
        bool electrodos_conectados = !(gpio_get_level(LO_PLUS) || gpio_get_level(LO_MINUS));
        
     
        
    }
}
