# Use the official k6 image as a base image
FROM grafana/k6:latest

# Set the working directory
WORKDIR /app

# Copy the k6 script into the container
COPY fluctuating-load.js .

# Command to run the k6 script
CMD ["run", "fluctuating-load.js"]
