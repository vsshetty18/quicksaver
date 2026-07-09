FROM python:3.11-slim

# Install build tools as a safety net in case any package needs to compile
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

# Train the model at build time so accident_model.pkl is always fresh
RUN python train_model.py

EXPOSE 5000
CMD ["python", "app.py"]
