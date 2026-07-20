const bcrypt = require("bcrypt");
const { UserLevel, Badge, LandingPageConfig } = require("../models/associations");
const Admin = require("../models/admin.model");
const xpManager = require("./xpManager");
const badgeManager = require("./badgeManager");

/**
 * Initialize system with default levels and badges
 */
const initializeSystemData = async () => {
	try {
		console.log("🔄 Initializing system data...");

		// Initialize user levels
		const levelsCount = await UserLevel.count();
		if (levelsCount === 0) {
			console.log("📊 Creating default user levels...");
			const levels = await xpManager.initializeDefaultLevels();
			console.log(`✓ Created ${levels.length} user levels`);
		} else {
			console.log(`✓ User levels already exist (${levelsCount} levels)`);
		}

		// Initialize badges
		const badgesCount = await Badge.count();
		if (badgesCount === 0) {
			console.log("🎖️  Creating default badges...");
			const badges = await badgeManager.createDefaultBadges();
			console.log(`✓ Created ${badges.length} badges`);
		} else {
			console.log(`✓ Badges already exist (${badgesCount} badges)`);
		}

		const adminCount = await Admin.count();
		if (adminCount === 0) {
			console.log("👑 Creating default admin account...");
			const hashedPassword = await bcrypt.hash("admin123", 10);
			await Admin.create({
				admin_name: "Admin User",
				username: "admin123",
				email: "admin@quizmaster.lk",
				password: hashedPassword,
			});
			console.log("✓ Created default admin account");
		} else {
			console.log(`✓ Admin account already exists (${adminCount} admin(s))`);
		}

		const configCount = await LandingPageConfig.count();
		if (configCount === 0) {
			console.log("📄 Creating default landing page configuration...");
			await LandingPageConfig.create({
				logo_url: null,
				icon_url: null,
				theme_color: "indigo",
				hero_title: "Master Every Subject",
				hero_sinhala: "විෂය සියල්ල ජය ගන්න",
				hero_desc: "Comprehensive practice for Mathematics, Sinhala, Environment & IQ — all in one place.",
				hero_design: "design1",
				subjects_design: "design1",
				features_design: "design1",
				testimonials_design: "design1",
			});
			console.log("✓ Created default landing page configuration");
		} else {
			console.log(`✓ Landing page configuration already exists (${configCount} row(s))`);
		}

		// Initialize Adventure Quests
		const { AdventureQuest, DailyTrial } = require("../models/associations");
		const questsCount = await AdventureQuest.count();
		if (questsCount === 0) {
			console.log("🗺️ Creating default adventure quests...");
			const defaultQuests = [
				// Zone 1: Grasslands
				{
					zone_id: 'grasslands',
					name: 'Math: Basic Numbers',
					description: 'Learn basic counts and numbers.',
					quest_type: 'weekly',
					xp_reward: 150,
					start_date: new Date('2026-01-01'),
					end_date: new Date('2036-12-31'),
					questions: [
						{
							text: 'What is 5 + 3?',
							options: [{ label: '7', isCorrect: false }, { label: '8', isCorrect: true }, { label: '9', isCorrect: false }, { label: '10', isCorrect: false }],
							explanation: '5 + 3 is equal to 8.',
							hint: 'Count on from 5 by 3 steps.'
						}
					],
					is_active: true
				},
				{
					zone_id: 'grasslands',
					name: 'Language: Sinhala Basics',
					description: 'Learn basic Sinhala letters.',
					quest_type: 'weekly',
					xp_reward: 150,
					start_date: new Date('2026-01-01'),
					end_date: new Date('2036-12-31'),
					questions: [
						{
							text: 'Identify the first letter of the Sinhala alphabet.',
							options: [{ label: 'ආ', isCorrect: false }, { label: 'අ', isCorrect: true }, { label: 'ඇ', isCorrect: false }, { label: 'ඉ', isCorrect: false }],
							explanation: 'අ is the first letter.',
							hint: 'It is the short vowel "a".'
						}
					],
					is_active: true
				},
				// Zone 2: Crystal Peaks
				{
					zone_id: 'crystal',
					name: 'Math: Geometric Slopes',
					description: 'Calculate vertical rises over horizontal runs.',
					quest_type: 'weekly',
					xp_reward: 200,
					start_date: new Date('2026-01-01'),
					end_date: new Date('2036-12-31'),
					questions: [
						{
							text: "What is the slope of a line passing through (0,0) and (4,8)?",
							options: [
								{ label: "1/2", isCorrect: false },
								{ label: "2", isCorrect: true },
								{ label: "4", isCorrect: false },
								{ label: "8", isCorrect: false }
							],
							explanation: "Slope (m) = (y2 - y1) / (x2 - x1) = (8 - 0) / (4 - 0) = 8 / 4 = 2.",
							hint: "Remember the formula: slope = vertical change / horizontal change."
						},
						{
							text: "Which equation represents a line with a slope of 3 and y-intercept of -2?",
							options: [
								{ label: "y = 2x - 3", isCorrect: false },
								{ label: "y = 3x - 2", isCorrect: true },
								{ label: "y = -2x + 3", isCorrect: false },
								{ label: "y = 3x + 2", isCorrect: false }
							],
							explanation: "Slope-intercept form is y = mx + c. With slope m = 3 and intercept c = -2, we get y = 3x - 2.",
							hint: "Use y = mx + c, where m is the slope and c is the y-intercept."
						},
						{
							text: "If line A is perpendicular to a line with slope -1/4, what is the slope of line A?",
							options: [
								{ label: "4", isCorrect: true },
								{ label: "-4", isCorrect: false },
								{ label: "1/4", isCorrect: false },
								{ label: "-1/4", isCorrect: false }
							],
							explanation: "Perpendicular slopes multiply to -1 (m1 * m2 = -1). The negative reciprocal of -1/4 is 4.",
							hint: "Perpendicular slopes are negative reciprocals. Flip the fraction and change the sign!"
						}
					],
					is_active: true
				},
				{
					zone_id: 'crystal',
					name: 'Science: Arctic Ecosystems',
					description: 'Learn about food chains in cold environments.',
					quest_type: 'weekly',
					xp_reward: 200,
					start_date: new Date('2026-01-01'),
					end_date: new Date('2036-12-31'),
					questions: [
						{
							text: "Which of the following is a primary producer in the Arctic Ocean?",
							options: [
								{ label: "Polar Bear", isCorrect: false },
								{ label: "Phytoplankton", isCorrect: true },
								{ label: "Ringed Seal", isCorrect: false },
								{ label: "Arctic Cod", isCorrect: false }
							],
							explanation: "Phytoplankton are microscopic marine algae that perform photosynthesis, forming the base of the food chain.",
							hint: "Think about the tiny organisms at the very bottom of the food chain that make energy from sunlight."
						},
						{
							text: "What is the term for permanently frozen soil found in the tundra?",
							options: [
								{ label: "Permafrost", isCorrect: true },
								{ label: "Ice Cap", isCorrect: false },
								{ label: "Glacial Silt", isCorrect: false },
								{ label: "Moraine", isCorrect: false }
							],
							explanation: "Permafrost is ground that remains completely frozen (0°C or colder) for at least two consecutive years.",
							hint: "It starts with 'Perma-' because it is permanent, and ends with '-frost'."
						},
						{
							text: "How do Arctic foxes adapt to seasonal changes in their habitat?",
							options: [
								{ label: "They hibernate all winter", isCorrect: false },
								{ label: "Their fur changes color from brown to white", isCorrect: true },
								{ label: "They migrate to tropical zones", isCorrect: false },
								{ label: "They lose their fur completely", isCorrect: false }
							],
							explanation: "Their white winter coat blends in with snow, while their brown summer coat blends with tundra rocks.",
							hint: "Think about how they stay camouflaged when the snow melts and reveals rocks and plants."
						}
					],
					is_active: true
				},
				// Zone 3: Volcanic Forge
				{
					zone_id: 'volcanic',
					name: 'Chemistry: Thermal Reactions',
					description: 'Learn endothermic and exothermic reactions.',
					quest_type: 'weekly',
					xp_reward: 250,
					start_date: new Date('2026-01-01'),
					end_date: new Date('2036-12-31'),
					questions: [
						{
							text: "Which type of reaction releases heat into the surroundings?",
							options: [
								{ label: "Endothermic", isCorrect: false },
								{ label: "Exothermic", isCorrect: true },
								{ label: "Isothermal", isCorrect: false },
								{ label: "Synthesis", isCorrect: false }
							],
							explanation: "Exothermic reactions release energy (heat), making the surroundings warmer (exo = outer, thermic = heat).",
							hint: "'Exo' means exit or release, like an exit door."
						},
						{
							text: "In an endothermic reaction, the energy of the products is:",
							options: [
								{ label: "Lower than reactants", isCorrect: false },
								{ label: "Higher than reactants", isCorrect: true },
								{ label: "Equal to reactants", isCorrect: false },
								{ label: "Zero", isCorrect: false }
							],
							explanation: "Since endothermic reactions absorb heat, the products store more energy than the initial reactants.",
							hint: "If a system absorbs energy, its final energy level must be higher."
						},
						{
							text: "What is the SI unit of heat energy?",
							options: [
								{ label: "Watt", isCorrect: false },
								{ label: "Joule", isCorrect: true },
								{ label: "Kelvin", isCorrect: false },
								{ label: "Pascal", isCorrect: false }
							],
							explanation: "The Joule (J) is the standard unit of work or energy in science.",
							hint: "It is named after the English physicist James Prescott Joule."
						}
					],
					is_active: true
				},
				{
					zone_id: 'volcanic',
					name: 'History: Ancient Metallurgy',
					description: 'Learn standard metallurgy of ancient civilizations.',
					quest_type: 'weekly',
					xp_reward: 250,
					start_date: new Date('2026-01-01'),
					end_date: new Date('2036-12-31'),
					questions: [
						{
							text: "Which alloy is created by combining copper and tin?",
							options: [
								{ label: "Brass", isCorrect: false },
								{ label: "Bronze", isCorrect: true },
								{ label: "Steel", isCorrect: false },
								{ label: "Pewter", isCorrect: false }
							],
							explanation: "Bronze is a metal alloy consisting primarily of copper, usually with tin as the main additive.",
							hint: "This metal gave its name to a historical 'Age' of human civilization."
						},
						{
							text: "The 'Iron Age' generally succeeded which archeological period?",
							options: [
								{ label: "Stone Age", isCorrect: false },
								{ label: "Bronze Age", isCorrect: true },
								{ label: "Copper Age", isCorrect: false },
								{ label: "Neolithic Age", isCorrect: false }
							],
							explanation: "The Bronze Age was succeeded by the Iron Age when smelting technologies allowed the widespread use of iron.",
							hint: "Before iron became popular, weapons and tools were made of copper and tin alloy."
						},
						{
							text: "Which ancient civilization is credited with the earliest known production of high-carbon Wootz steel?",
							options: [
								{ label: "Ancient Rome", isCorrect: false },
								{ label: "Ancient Sri Lanka/India", isCorrect: true },
								{ label: "Ancient Egypt", isCorrect: false },
								{ label: "Mesopotamia", isCorrect: false }
							],
							explanation: "Crucible steel (Wootz steel) was produced in ancient Sri Lanka and Southern India as early as 300 BCE.",
							hint: "It is in South Asia, known for ancient metalwork and wind tunnels on mountains."
						}
					],
					is_active: true
				}
			];
			
			// Associate badges if found
			const { Badge: BadgeModel } = require("../models/associations");
			await BadgeModel.findOrCreate({
				where: { name: 'Grasslands Champion' },
				defaults: {
					description: "Complete all trials in Zone 1: The Grasslands. (තණබිම් ජයග්‍රාහකයා)",
					icon_url: "/badges/grasslands-champ.png",
					badge_type: "special",
					xp_required: null
				}
			});
			await BadgeModel.findOrCreate({
				where: { name: 'Crystal Peaks Champion' },
				defaults: {
					description: "Complete all trials in Zone 2: Crystal Peaks. (ස්ඵටික කඳු වැටි ජයග්‍රාහකයා)",
					icon_url: "/badges/crystal-champ.png",
					badge_type: "special",
					xp_required: null
				}
			});
			await BadgeModel.findOrCreate({
				where: { name: 'Volcanic Forge Champion' },
				defaults: {
					description: "Complete all trials in Zone 3: Volcanic Forge. (ගිනි කන්ද බටහිර ජයග්‍රාහකයා)",
					icon_url: "/badges/volcanic-champ.png",
					badge_type: "special",
					xp_required: null
				}
			});

			const grasslandsBadge = await BadgeModel.findOne({ where: { name: 'Grasslands Champion' } });
			const crystalBadge = await BadgeModel.findOne({ where: { name: 'Crystal Peaks Champion' } });
			const volcanicBadge = await BadgeModel.findOne({ where: { name: 'Volcanic Forge Champion' } });
			
			if (grasslandsBadge) {
				defaultQuests.filter(q => q.zone_id === 'grasslands').forEach(q => q.badge_id = grasslandsBadge.id);
			}
			if (crystalBadge) {
				defaultQuests.filter(q => q.zone_id === 'crystal').forEach(q => q.badge_id = crystalBadge.id);
			}
			if (volcanicBadge) {
				defaultQuests.filter(q => q.zone_id === 'volcanic').forEach(q => q.badge_id = volcanicBadge.id);
			}

			await AdventureQuest.bulkCreate(defaultQuests);
			console.log("✓ Adventure quests seeded successfully!");
		}

		// Initialize Daily Trials
		const trialsCount = await DailyTrial.count();
		if (trialsCount === 0) {
			console.log("📅 Creating default daily trials...");
			const todayStr = new Date().toISOString().split('T')[0];
			const defaultTrials = [
				{
					title: 'Rapid Fire Vocabulary',
					description: 'Learn fast words and boost vocabulary!',
					xp_reward: 150,
					type: 'vocab',
					active_date: todayStr,
					questions: [
						{
							text: 'What is a synonym of "Huge"?',
							options: [{ label: 'Tiny', isCorrect: false }, { label: 'Gigantic', isCorrect: true }, { label: 'Small', isCorrect: false }, { label: 'Weak', isCorrect: false }],
							explanation: '"Gigantic" means extremely large, similar to "Huge".',
							hint: 'Starts with the letter "G".'
						},
						{
							text: 'What is the opposite of "Polite"?',
							options: [{ label: 'Kind', isCorrect: false }, { label: 'Rude', isCorrect: true }, { label: 'Gentle', isCorrect: false }, { label: 'Nice', isCorrect: false }],
							explanation: '"Rude" is the antonym/opposite of "Polite".',
							hint: 'Starts with the letter "R".'
						}
					]
				},
				{
					title: 'Team Science Bowl',
					description: 'Answer questions about standard science facts!',
					xp_reward: 180,
					type: 'science',
					active_date: todayStr,
					questions: [
						{
							text: 'Which planet is known as the Red Planet?',
							options: [{ label: 'Venus', isCorrect: false }, { label: 'Mars', isCorrect: true }, { label: 'Jupiter', isCorrect: false }, { label: 'Saturn', isCorrect: false }],
							explanation: 'Mars is called the Red Planet due to iron oxide on its surface.',
							hint: 'Named after the Roman god of war.'
						},
						{
							text: 'What gas do plants absorb from the atmosphere for photosynthesis?',
							options: [{ label: 'Oxygen', isCorrect: false }, { label: 'Carbon Dioxide', isCorrect: true }, { label: 'Nitrogen', isCorrect: false }, { label: 'Hydrogen', isCorrect: false }],
							explanation: 'Plants absorb Carbon Dioxide (CO2) to perform photosynthesis.',
							hint: 'Humans exhale this gas.'
						}
					]
				}
			];
			await DailyTrial.bulkCreate(defaultTrials);
			console.log("✓ Daily trials seeded successfully!");
		}

		console.log("✓ System data initialization complete!");
		return true;
	} catch (error) {
		console.error("✗ Error initializing system data:", error.message);
		return false;
	}
};

module.exports = {
	initializeSystemData,
};
