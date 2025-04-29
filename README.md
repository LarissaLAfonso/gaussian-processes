# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

---

# Visualization Motivation
The developed web page aims to provide a didactic and accessible explanation of gaussian processes, having in mind those who have not yet been introduced to this concept. A Gaussian process is a stochastic process — a collection of random variables indexed by time or space — of which any finite subset follows a multivariate normal distribution. This type of process is extremely important in areas such as regression and uncertainty modeling.

## Generation of Multivariate Normals
To generate samples from a multivariate normal distribution in JavaScript, we followed these steps:

- Generate standard normal variables.

- Apply Cholesky decomposition to the covariance matrix in order to obtain a lower triangular matrix. This matrix is used to introduce the correct correlations and variances into the samples.

- Multiply the triangular matrix by the vectors of standard normal variables and add the desired mean to obtain the multivariate samples.

## Creative Process
For the explanation of Gaussian Processes, we used a _scrollytelling_ approach, inspired mainly by [this](https://mathisonian.github.io/kde/) and [this](https://github.com/yizhe-ang/k-means-explorable/tree/main) visualizations. We built plots accompanied by explaining text blocks, in an attempt to clarify the pertaining concepts. We detail the developed charts below:

- Chart 1: First, a static chart is displayed showing several points on the plane.

- Chart 2: We introduce the idea that a set _n_ points in ℝ² can be represented as _one_ point in R^n. The chart displays three points in ℝ² corresponding to coordinates in ℝ³, highlighted with distinct colors. There is also a button that allows resampling of the points.

- Chart 3: To illustrate the idea of a growing number of points as _n_ → ∞, we present a scatter plot to represent this phenomenon. The exponential increase in complexity makes the direct analysis of the density \( F \) practically intractable, especially in high-dimensional spaces. The chart used is static, serving as a visual metaphor for how quickly interpretability breaks down as the number of dimensions and data points grows.

- Chart 4: We show prior samples of the function 𝑓 (without incorporating observed data). The data is generated at uniform intervals, and the chart allows users to select different kernels and adjust their parameters. Since the samplings are random, any configuration change generates new curves randomly.

- Chart 5: With the same interactivities as the previous chart, this one emphasizes the randomness of the process. Instead of isolated points, continuous lines are generated representing possible functions of the process. New lines are periodically added (with a maximum limit of 15), with a smooth visual transition between old and new samples.

- Chart 6: A set of sample paths drawn from a Gaussian Process (GP). Each vertical line connects consecutive points sampled from a multivariate Gaussian distribution, illustrating the continuity and smoothness typically associated with realizations of GPs. This visual reinforces the idea that a GP defines a distribution over functions, where any finite subset of inputs induces a multivariate Gaussian distribution. The smooth connections between points are not arbitrary — they result from the structure of the covariance function, which encodes assumptions such as smoothness, periodicity, or stationarity.

- Chart 7: This chart presents the function of each kernel, allowing the user to select which one to view. Below the chart, we added explanations on how to interpret each kernel function.

- Chart 8: Finally, this chart also deals with prior distributions, but now for the four studied kernels simultaneously. Four lines are displayed, each representing a different kernel. The user can filter which kernels they want to visualize and generate new samples using a refresh button.

## Task Division and Working Time
Although we did not record individual working hours, we estimate that each member dedicated over 40 active hours to the project. A large portion of this time was spent on theoretical understanding of gaussian processes, grasping the scrollama framework and overcoming limitations in generating normal data in JavaScript.

- Larissa: General structure of the page, footer, Chart 1, Chart 2, Chart 3, Chart 6. 

- Luciano: Data generation, Website deploy, Chart 7, and Chart 8.

- Kaiky: Page title, general styling, Chart 4, and Chart 5.

> Note: Despite the division above, the work was carried out collaboratively, with all members contributing to multiple parts of the project.
