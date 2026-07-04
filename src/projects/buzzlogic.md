---
name: "Beehive Machine Learning Model"
tech: ["ultralytics", "yolo", "python"]
thumbnail: "buzzlogic.png"
description: "A small YOLOv11 machine learning model that classifies types of honeybees, comb, and the varroa destructor mite."
download: ""
github: "buzzlogic"
---

A small YOLOv11 machine learning model that classifies types of honeybees, comb, and the varroa destructor mite. Datasets were annotated using [CVAT](https://www.cvat.ai) and [label-studio](https://labelstud.io]). The datasets and weights from this project were used in an experiment conducted by a student at Middle Georgia State University. I was able aid the process by answering questions about the project from Associate Professor of Biology Kirby Swenson. I experimented with two models: one that classified bees and mites by drawing bounding boxes around them, and one that classified comb within the hive by drawing a polygonal mask over sections of it. The latter model has lower accuracy, as it requires more data to train and more VRAM to analyze than I have access to.