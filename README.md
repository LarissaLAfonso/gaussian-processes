# Visualization Motivation
The developed web page aims to provide a didactic and accessible explanation of gaussian processes. **The only prerequisite is a little background on probability**, and some familiarity with machine learning or some field of pure math might be useful given the abstract nature of the subject.

A Gaussian process is a stochastic process — a collection of random variables indexed by time or space — of which any finite subset follows a multivariate normal distribution. This type of process is extremely important in areas such as regression and uncertainty modeling.

## Generation of Multivariate Normals
To generate samples from a multivariate normal distribution in JavaScript, we followed these steps:

- Generate standard normal variables.

- Apply Cholesky decomposition to the covariance matrix in order to obtain a lower triangular matrix. This matrix is used to introduce the correct correlations and variances into the samples.

- Multiply the triangular matrix by the vectors of standard normal variables and add the desired mean to obtain the multivariate samples.

## Creative Process
For the explanation of Gaussian Processes, we used a _scrollytelling_ approach, inspired mainly by [this](https://mathisonian.github.io/kde/) and [this](https://github.com/yizhe-ang/k-means-explorable/tree/main) visualizations. We built plots accompanied by explaining text blocks, in an attempt to clarify the pertaining concepts. We detail the developed charts below:

- Chart 1: A static chart is initially displayed, showing several points on the plane.

- Chart 2: We use the same chart to illustrate that each point has a different height. An animation is used to highlight the height of each point individually.

- Chart 3: We introduce the idea that a set of n points in ℝ² can be represented as a single point in ℝⁿ. The chart shows three points in ℝ² corresponding to coordinates in ℝ³, each highlighted with a different color. A button allows resampling of the points. Each height from the original ℝ² representation becomes a coordinate in ℝ³.

- Chart 4: Next, we plot the prior distribution of samples. A scatter plot is used to represent uncertainty about the function's values at each point x in the input space.

- Chart 5: Using the previous chart, we construct a function that generalizes the prior samples, enabling the incorporation of new data. In general, the data exhibit uncertainty and have a default mean, as indicated by the confidence interval and the mean line. To achieve this, we build a function from the points in the previous chart.

- Chart 6: This chart presents the shape of each kernel function, allowing the user to select which one to view. Below the chart, we include explanations on how to interpret each kernel. Additionally, the mathematical formulas are explained with supporting text.

- Chart 7: We then compare prior functions generated using different kernels. Four lines are plotted, each representing a different kernel and color-coded according to the legend. The user can toggle each kernel on or off; deselected kernels appear with reduced opacity. A button below the chart allows for resampling of the prior functions.

- Chart 8: Finally, we show how a regression model is trained with data. Red points (training points) can be added or removed interactively. The chart displays sample functions over the test set, along with their predicted values and the uncertainty band. Users can also combine different kernels for the analysis. All elements are indicated in the legend, and animations are used throughout to ensure a smooth user experience.

> Note: We do not put titles on the chats when unnecessary, as well as the axis.

## Task Division and Working Time
Although we did not record individual working hours, we estimate that each member dedicated over 50 active hours to the project. A large portion of this time was spent on theoretical understanding of gaussian processes, grasping the scrollama framework and overcoming limitations in generating normal data in JavaScript.

- Larissa: General structure of the page, footer, Chart 1, Chart 2, Chart 3.

- Luciano: Data generation, Website deploy, Chart 6 and Chart 7.

- Kaiky: Page title, general styling, Chart 4, Chart 5 and Chart 8.

> Note: Despite the division above, the work was carried out collaboratively, with all members contributing to multiple parts of the project.

---

Access the page [here](https://fgv-vis-2025.github.io/tarefa-4-gaussian-processes/).
