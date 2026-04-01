import pandas as pd
import random
import numpy as np

def generate_data(num_rows=1500):
    rows = []
    prev_occupancy_state = 0
    
    for _ in range(num_rows):
        hour = random.randint(0, 23)
        
        # Chronological influence: 80% chance to remain in the same state
        if random.random() < 0.8:
            base_presence = prev_occupancy_state
        else:
            base_presence = 1 if random.random() > 0.7 else 0 
            
        temperature = round(random.uniform(22.0, 32.0), 2)
        humidity = round(random.uniform(40.0, 80.0), 2)
        voltage = round(random.uniform(4.8, 5.2), 2)
        
        # Occupancy logic
        if base_presence == 1:
            occupancy = 1
        elif 9 <= hour <= 18 and random.random() > 0.3:
            occupancy = 1
        else:
            occupancy = 0
            
        prev_occupancy = prev_occupancy_state
        prev_occupancy_state = occupancy # save for next row
            
        # LED & Motor logic
        if occupancy == 1:
            ledCurrent = round(random.uniform(0.01, 0.05), 2)
            motorCurrent = round(random.uniform(0.1, 0.4), 2)
        else:
            # If not occupied, normally devices are off
            if random.random() > 0.85: # 15% chance of wastage
                ledCurrent = round(random.uniform(0.01, 0.05), 2) if random.random() > 0.5 else 0.0
                motorCurrent = round(random.uniform(0.1, 0.4), 2) if random.random() > 0.5 else 0.0
                if ledCurrent == 0.0 and motorCurrent == 0.0:
                    motorCurrent = round(random.uniform(0.1, 0.4), 2) # force wastage
            else:
                ledCurrent = 0.0
                motorCurrent = 0.0
        
        ledPower = round(ledCurrent * voltage, 2)
        motorPower = round(motorCurrent * voltage, 2)
        
        # Wastage logic: not occupied but any device is drawing current
        wastage = 1 if occupancy == 0 and (ledCurrent > 0.0 or motorCurrent > 0.0) else 0
        
        rows.append([hour, temperature, humidity, prev_occupancy, occupancy, ledCurrent, motorCurrent, voltage, ledPower, motorPower, wastage])
    
    df = pd.DataFrame(rows, columns=[
        "hour", "temperature", "humidity", "prev_occupancy", "occupancy", "ledCurrent", "motorCurrent", "voltage", "ledPower", "motorPower", "wastage"
    ])
    df.to_csv("dataset.csv", index=False)
    print(f"Generated {num_rows} rows in dataset.csv")

if __name__ == "__main__":
    generate_data()
