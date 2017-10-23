package salvo.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.naming.NamingEnumeration;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.springframework.security.config.http.MatcherType.ant;

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
            Player p1 = new Player ( "Joan", "Temporal");
			playRepo.save(p1);

			Player p2 = new Player("Chloe O'Brian", "Temporal10");
			playRepo.save(p2);

			Player p3 = new Player("Kim Bauer", "Temporal14");
			playRepo.save(p3);

			Player p4 = new Player("Tony Almeida", "mole");
			playRepo.save(p4);

			Player p5 = new Player("Oruj", "14");
			playRepo.save(p5);

			Player p6 = new Player("Victor", "carpios23");
			playRepo.save(p6);


			// Save a couple of games

            Game G1 = new Game();
			gameRepo.save(G1);

			Game G2 = new Game(3600);
			gameRepo.save(G2);

			Game G3 = new Game(7200);
			gameRepo.save(G3);

			Game G4 = new Game(7200);
			gameRepo.save(G4);

			Game G5 = new Game();
			gameRepo.save(G5);

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

            GamePlayer GP6 = new GamePlayer(p5, G2);
            GPRepo.save(GP6);

            GamePlayer GP7 = new GamePlayer(p6, G4);
            GPRepo.save(GP7);

            GamePlayer GP8 = new GamePlayer(p5, G4);
            GPRepo.save(GP8);

            GamePlayer GP9 = new GamePlayer(p5, G5);
            GPRepo.save(GP9);

            GamePlayer GP10 = new GamePlayer(p6, G5);
            GPRepo.save(GP10);


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

            Score s6 = new Score(p5, G2, 1);
            scoreRepo.save(s6);

            Score s7 = new Score(p5, G4, 1);
            scoreRepo.save(s7);

            Score s8 = new Score(p6, G4, 0);
            scoreRepo.save(s8);

            Score s9 = new Score(p5, G5, 1);
            scoreRepo.save(s9);

            Score s10 = new Score(p6, G5, 0);
            scoreRepo.save(s10);

		};

	}

}

@Configuration
class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {

    @Autowired
    private
    PlayerRepository playerRepository;

    @Override
    public void init(AuthenticationManagerBuilder auth) throws Exception{
        auth.userDetailsService(userDetailsService());
    }

    @Bean
    UserDetailsService userDetailsService(){
        return new UserDetailsService() {

            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

                Player player = playerRepository.findByUserName(username);
                if (player != null){
                    return new User(player.getUserName(), player.getPassword(), AuthorityUtils.createAuthorityList("USER"));
                } else {

                    throw new UsernameNotFoundException("Unknown user: " + username);

                }
            }
        };
    }
}

@EnableWebSecurity
@Configuration
class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        //Authority Roles PATHS: //
        http.authorizeRequests()

                .antMatchers("/web/games.html").permitAll()
                .antMatchers("/web/styles/*").permitAll()
                .antMatchers("/web/styles/icons/*").permitAll()
                .antMatchers("/web/styles/partials/*").permitAll()
                .antMatchers("/web/styles/images/*").permitAll()
                .antMatchers("/web/styles/sounds/*").permitAll()
                .antMatchers("/api/games").permitAll()
                .antMatchers("/web/js/*").permitAll()
				.antMatchers("/api/players").permitAll()

                .antMatchers("/api/game_view/*").hasAuthority("USER")
                .antMatchers("/web/game.html*").hasAuthority("USER")

                // That blocks all urls //
                .anyRequest().authenticated();

        //Configurin login and logout //

        http.formLogin()
                .usernameParameter("username")
                .passwordParameter("password")
                .loginPage("/api/login");

        http.logout().logoutUrl("/api/logout");

        // turn off checking for CSRF tokens
        http.csrf().disable();

        // if user is not authenticated, just send an authentication failure response
        http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

        // if login is successful, just clear the flags asking for authentication
        http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));

        // if login fails, just send an authentication failure response
        http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

        // if logout is successful, just send a success response
        http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());
    }

    private void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
        }
    }
}