FROM python:3.9-slim

WORKDIR /app

# Instalar dependências
RUN pip install --no-cache-dir flask flask-cors numpy

# Copiar servidor
COPY openvoice_real_server.py .

# Expor porta
EXPOSE 3000

# Comando para executar
CMD ["python", "openvoice_real_server.py"]
