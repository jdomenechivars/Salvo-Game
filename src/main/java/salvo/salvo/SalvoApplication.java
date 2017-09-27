package salvo.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Date;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}


	@Bean
	public CommandLineRunner initData(PlayerRepository playRepo,
									  GameRepository gameRepo,
									  GamePlayerRepository GPRepo){

		return args -> {
			// save a couple of customers
            Player p1 = new Player ( "jdomenechivars@gmail.com");
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

            GamePlayer GP6 = new GamePlayer(p2, G2);
            GPRepo.save(GP6);


        };

	}

}
