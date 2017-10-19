package salvo.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}


	@Bean
	public CommandLineRunner initData(PlayerRepository playRepo,
									  GameRepository gameRepo,
									  GamePlayerRepository GPRepo,
									  ShipRepository shipRepo,
                                      SalvoRepository salvoRepo,
                                      ScoreRepository scoreRepo){

		return args -> {
			// save a couple of customers
            Player p1 = new Player ( "Joan D.");
			playRepo.save(p1);

			Player p2 = new Player("Chloe O'Brian");
			playRepo.save(p2);

			Player p3 = new Player("Kim Bauer");
			playRepo.save(p3);

			Player p4 = new Player("Tony Almeida");
			playRepo.save(p4);

			// Save a couple of games

            Game G1 = new Game();
			gameRepo.save(G1);

			Game G2 = new Game(3600);
			gameRepo.save(G2);

			Game G3 = new Game(7200);
			gameRepo.save(G3);

			Game G4 = new Game(7200);
			gameRepo.save(G4);

			// Save a couple of gamePlayers

            GamePlayer GP1 = new GamePlayer(p1, G1);
			GPRepo.save(GP1);
			Player p = playRepo.findOne(1l);

			GamePlayer GP2 = new GamePlayer(p2, G1);
			GPRepo.save(GP2);

			GamePlayer GP3 = new GamePlayer(p3, G3);
			GPRepo.save(GP3);

			GamePlayer GP4 = new GamePlayer(p1,G3);
            GPRepo.save(GP4);

            GamePlayer GP5 = new GamePlayer(p4, G2);
            GPRepo.save(GP5);

//            GamePlayer GP6 = new GamePlayer(p2, G2);
//            GPRepo.save(GP6);

            //Save a couple of ships
/*
			carrier 5
			battle Ship 4
			submarine 3
			destroyer 3
			patrol boat 2
*/

			List<String> loc1 = new ArrayList<>();
			loc1.add("A1");
			loc1.add("A2");
			loc1.add("A3");
			loc1.add("A4");
			loc1.add("A5");

			Ship ship1 = new Ship("Carrier",loc1);

			List<String> loc2 = Arrays.asList("B3", "B4", "B5","B6");

			Ship ship2 = new Ship("Battle Ship", loc2);

			List<String> loc3 = Arrays.asList("E5", "F5", "G5");

			Ship ship3 = new Ship("Submarine",loc3);

			List<String> loc4 = Arrays.asList("F1", "G1", "H1");

			Ship ship4 = new Ship("Destroyer",loc4);

			List<String> loc5 = Arrays.asList("I5","I6");

			Ship ship5 = new Ship("Patrol Boat", loc5);

			GP1.addShip(ship1);
			shipRepo.save(ship1);

			GP1.addShip(ship2);
			shipRepo.save(ship2);

			GP1.addShip(ship3);
			shipRepo.save(ship3);

			GP1.addShip(ship4);
			shipRepo.save(ship4);

			GP1.addShip(ship5);
			shipRepo.save(ship5);


			List<String> loc6 = new ArrayList<>();
			loc6.add("B1");
			loc6.add("B2");
			loc6.add("B3");
			loc6.add("B4");
			loc6.add("B5");

			Ship ship6 = new Ship("Carrier",loc6);

			List<String> loc8 = Arrays.asList("H3", "H4", "H5","H6");

			Ship ship8 = new Ship("Battle Ship", loc8);

			List<String> loc9 = Arrays.asList("I5", "I6", "I7");

			Ship ship9 = new Ship("Submarine",loc9);

			List<String> loc10 = Arrays.asList("A1", "A2", "A3");

			Ship ship10 = new Ship("Destroyer",loc10);

			List<String> loc7 = Arrays.asList("C5","C6");

			Ship ship7 = new Ship("Patrol Boat", loc7);

			GP2.addShip(ship6);
			shipRepo.save(ship6);

			GP2.addShip(ship8);
			shipRepo.save(ship8);

			GP2.addShip(ship9);
			shipRepo.save(ship9);

			GP2.addShip(ship10);
			shipRepo.save(ship10);

			GP2.addShip(ship7);
			shipRepo.save(ship7);

			// Save a couple of Salvos

			List<String> salLoc1 = Arrays.asList("B1", "C4", "J5","B6", "F1");

			Salvo salvo1 = new Salvo(1, salLoc1);

			GP1.addSalvo(salvo1);
			salvoRepo.save(salvo1);

			List<String> salLoc3 = Arrays.asList("C3", "B5", "A1", "E1", "E2" );

			Salvo salvo3 = new Salvo(2, salLoc3);

			GP1.addSalvo(salvo3);
			salvoRepo.save(salvo3);

			List<String> salLoc2 = Arrays.asList("B8", "I4", "J5", "B10", "F1");
            Salvo salvo2 = new Salvo(1, salLoc2);

			GP2.addSalvo(salvo2);
			salvoRepo.save(salvo2);

			List<String> salLoc4 = Arrays.asList("A1", "H10", "E5", "B6","C10");
			Salvo salvo4 = new Salvo(2, salLoc4);

            GP2.addSalvo(salvo4);
            salvoRepo.save(salvo4);

            //Add some scores

            Score s1 = new Score(p1, G1,1);
            scoreRepo.save(s1);

            Score s2 = new Score(p2, G1, 0);
            scoreRepo.save(s2);

            Score s3 = new Score(p4, G2, 0);
            scoreRepo.save(s3);

            Score s4 = new Score(p1, G3, 1);
            scoreRepo.save(s4);

            Score s5 = new Score(p3, G3, 5);
            scoreRepo.save(s5);





		};

	}

}
