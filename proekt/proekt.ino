#include "dht.h"
#define dht_apin A0

#include <SPI.h>
#include <Adafruit_GFX.h>
#include <TFT_ILI9163C.h>
#include <Ethernet.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 2
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

byte mac[] = { 0x54, 0x34, 0x41, 0x30, 0x30, 0x31 };                                       

EthernetClient client;
char server[] = "*************"; // ім'я сервера www.arduino.ua
int buff=0;
const int led=5;

#if defined(__SAM3X8E__)
#undef __FlashStringHelper::F(string_literal)
#define F(string_literal) string_literal
#endif

#define MAX_FLOWTIME 15 // seconds
#define MIN_FLOWTIME 4 // seconds

// другий регулятор керування частоти поливу від одного разу в день до одного разу в тиждень
#define MAX_PERIOD 7 // days
#define MIN_PERIOD 1 // days

#define MAX 1015
#define MIN 0
// Color definitions
#define  BLACK   0x0000
#define BLUE    0x001F
#define RED     0xF800
#define GREEN   0x07E0
#define CYAN    0x07FF
#define MAGENTA 0xF81F
#define YELLOW  0xFFE0
#define WHITE   0xFFFF

uint8_t errorCode = 0;

#define __CS 10
#define __DC 6

int volumePin = A0; // Пін,до якого підключений регулятор, відповідаючий за об'єм поливу води
int periodPin = A1; // Пін, до якого підключений регулятор, відповідаючий за об'єм між поливами
int pumpPin = 5; // Пін, до якого підключене керування насосом

int volume;
int period;

dht DHT;
TFT_ILI9163C display = TFT_ILI9163C(10, 8, 9);
int aPin=A0;
int avalue=0;


int minvalue=220;

int maxvalue=600;


void water() {
  digitalWrite(pumpPin, HIGH); // включаєм насос
  delay(volume);
  digitalWrite(pumpPin, LOW); // виключаєм насос
  delay(period);  
}

void setup ()
{
 Serial.begin(9600);
  pinMode(pumpPin, OUTPUT);
  digitalWrite(pumpPin, LOW);
  display.begin ();
  display.setBitrate (24000000);
  display.setRotation (2);
  display.clearScreen ();
  delay(500);//Delay to let system boot
  Serial.println("DHT11 Humidity & temperature Sensor\n\n");
  delay(1000);//Wait before accessing Sensor
  Ethernet.begin(mac);
  sensors.begin();
  pinMode( led, OUTPUT);
  digitalWrite(led, LOW);
}


void loop() {
  // зчитуємо значення регуляторів (змінних резисторів) і приводимо їх до заданих меж
  volume = map(analogRead(volumePin), MIN, MAX, MIN_FLOWTIME, MAX_FLOWTIME) * 1000; 
  period = map(analogRead(periodPin), MIN, MAX, MIN_PERIOD, MAX_PERIOD) * 1000 * 60 * 60 * 24; 
 
  water();
  avalue=analogRead(aPin);
  DHT.read11(dht_apin);
    Serial.print("avalue=");
    Serial.println(avalue);
    Serial.print("Current humidity = ");
    Serial.print(DHT.humidity);
    Serial.print("%  ");
    Serial.print("temperature = ");
    Serial.print(DHT.temperature); 
    Serial.println("C  ");

    display.fillScreen ();
    display.setCursor (0, 0);
    display.setTextColor (GREEN); 
    //display.setTextSize (1);
   // display.print ("Демонстрація датчика DHT");

 display.setCursor (2, 52);
 display.print("avalue-");
 display.print (avalue);
 display.setTextSize (0);
 display.print ("%");
 // Відображення температури в C
 display.setCursor (2, 12);
 display.print("Temperature-");
 display.print (DHT.temperature);
 display.setTextSize (0);
 display.print ("C");

 display.setCursor (2, 92);
 display.print("H-");
 display.print (DHT.humidity);
 display.setTextSize (1);
 display.print ("%");
 delay(5000);
  sensors.requestTemperatures();
  
    if (client.connect(server, 80)) 
{

    client.print( "GET /add_data.php?");
    client.print("temperature=");
    client.print( sensors.getTempCByIndex(0) );
    client.print("&");
    client.print("&");
    client.print("temperature1=");
    client.print( sensors.getTempCByIndex(1) );
    client.println( " HTTP/1.1");
    client.print( "Host: " );
    client.println(server);
    client.println( "Connection: close" );
    client.println();
    client.println();
   
    delay(200);
    
      while (client.available())
 {
      char c = client.read();
        if ( c=='1')
        {
        buff=1;
        }
        if ( c=='0')
        {
         buff=0;
        }
      } 
      client.stop();
      client.flush();
      delay(100); 
  }
  else 
  {
   client.stop();
   delay(1000);
   client.connect(server, 80);
  }

  if ( buff==1)
        {
        digitalWrite (pumpPin, HIGH);
        delay(10000);
        digitalWrite(pumpPin, LOW);
        }
        else
        {
          digitalWrite(pumpPin, LOW);
        }
  delay(500);
 }
