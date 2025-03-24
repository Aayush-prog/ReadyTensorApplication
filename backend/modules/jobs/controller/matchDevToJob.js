const tf = require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
const mongoose = require("mongoose");

const matchDevToJob = async (req, res) => {
  const id = req.user._id;
  console.log("Matching a single developer with jobs...");

  // Models
  const JobModel = mongoose.model("Job");
  const UserModel = mongoose.model("User");

  try {
    // Fetch all jobs and the specific developer from the database
    const jobs = await JobModel.find();
    const developer = await UserModel.findById(id);

    if (!developer) {
      return res.status(404).json({ error: "Developer not found." });
    }
    const developerInput = [...developer.skills, developer.tag].join(" ");

    // Load the Universal Sentence Encoder model
    const model = await use.load();

    // Prepare a function to calculate semantic similarity
    async function calculateSimilarities(jobTags, developerInput) {
      const inputs = [developerInput].concat(
        jobTags.map((job) => job.requiredTags.join(" "))
      );

      const embeddings = await model.embed(inputs);
      const developerEmbedding = embeddings.slice([0, 0], [1]);
      const jobEmbeddings = embeddings.slice([1, 0]);

      const similarities = jobEmbeddings
        .dot(developerEmbedding.transpose())
        .arraySync()
        .flat();

      return jobs.map((job, index) => ({
        job,
        score: (similarities[index] * 100).toFixed(2), // Convert to percentage
      }));
    }

    // Calculate matches for the developer
    const matches = await calculateSimilarities(jobs, developerInput);

    // Filter jobs with more than 70% match
    const filteredMatches = matches
      .filter((match) => match.score > 70)
      .map((match) => ({
        _id: match.job._id,
        title: match.job.title,
        description: match.job.description,
        catchphrase: match.job.catchphrase,
        additionalInfo: match.job.additionalInfo,
        budget: match.job.budget,
        status: match.job.status,
        client: match.job.client,
        developer: match.job.developer,
        requiredTags: match.job.requiredTags,
        applicants: match.job.applicants,
      }));

    if (filteredMatches.length === 0) {
      return res.status(200).json({
        message: "No jobs matched",
      });
    }

    // Return the developer and their matching jobs
    res.status(200).send({
      developer,
      data: filteredMatches,
    });
  } catch (error) {
    console.error("Error matching developer with jobs:", error);
    res.status(500).json({
      error: "An error occurred while matching the developer with jobs.",
    });
  }
};

module.exports = matchDevToJob;
