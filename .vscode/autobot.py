import pyautogui
import random
import time

# === SETTINGS ===
x_minutes = 322   # How long to run (in minutes)
word_delay = 0.2  # Delay between words (seconds)
save_probability = 0.1  # 5% chance after every line to press Ctrl+S

# === TypeScript Snippets ===
variables = ["let", "const", "var"]
types = ["number", "string", "boolean", "any"]
function_names = ["add", "getUser", "fetchData", "calculateSum", "printMessage"]
var_names = ["x", "y", "result", "userName", "isActive"]

# === Generate random TypeScript code ===
def generate_random_code():
    choice = random.choice(["variable", "function", "typealias"])
    if choice == "variable":
        return f"{random.choice(variables)} {random.choice(var_names)}: {random.choice(types)} = {random_value(random.choice(types))};"
    elif choice == "function":
        return f"function {random.choice(function_names)}({random.choice(var_names)}: {random.choice(types)}): {random.choice(types)} {{ return {random_value(random.choice(types))}; }}"
    else:
        return f"type {random.choice(var_names).capitalize()}Type = {random.choice(types)};"

def random_value(t):
    if t == "number":
        return str(random.randint(1, 100))
    elif t == "string":
        return f'"{random.choice(["hello", "world", "typescript", "test"])}"'
    elif t == "boolean":
        return random.choice(["true", "false"])
    else:
        return "null"

# === Type a string like a human (word by word) ===
def human_type(text):
    words = text.split(" ")
    for word in words:
        pyautogui.typewrite(word, interval=0.05)  # Type word fast
        pyautogui.typewrite(' ')  # Space after word
        time.sleep(word_delay + random.uniform(-0.1, 0.2))  # Random slight variation

# === Save the file (Ctrl+S) ===
def save_file():
    pyautogui.hotkey('ctrl', 's')

# === Main loop ===
def main():
    print("Starting in 5 seconds... move your cursor to the text editor!")
    time.sleep(5)
    
    end_time = time.time() + x_minutes * 60
    while time.time() < end_time:
        code = generate_random_code()
        human_type(code)
        pyautogui.press('enter')
        time.sleep(random.uniform(0.3, 0.7))  # Slight pause between lines
        
        # Randomly decide to save
        if random.random() < save_probability:
            save_file()
            time.sleep(random.uniform(0.2, 0.5))  # Short pause after save

    print("Done typing!")

if __name__ == "__main__":
    main()